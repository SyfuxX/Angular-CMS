import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../config/environment/config.service';
import { mailFrom } from '../../config/mail.config';
import { jwtConstants } from '../constants/jwt.constants';
import { MailService } from '../mail/mail.service';
import { JwtTokenDto } from '../models/dto/jwt.dto';
import { PayloadInterface } from '../models/interfaces/payload.interface';
import { UserInterface } from '../models/interfaces/user.interface';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import superchargeStrings from '@supercharge/strings';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly _userService: UserService,
        private readonly _jwtService: JwtService,
        private readonly _mailService: MailService,
        private readonly _configService: ConfigService,
    ) {
    }

    public async validateUser(username: string, password: string): Promise<UserInterface> {
        const user: User = await this._userService.findByUsername(username, false);

        if (user && (
            await this._checkPassword(user.password, password)
        )) {
            const { password, ...result } = user;

            return result;
        } else {
            throw new BadRequestException('UsernameOrPasswordIncorrect');
        }
    }

    public async login(user: UserInterface): Promise<JwtTokenDto> {
        const payload: PayloadInterface = {
            username: user.username,
            sub: user.id,
            role: user.role,
        };

        return {
            access_token: this._jwtService.sign(payload),
            refresh_token: this._jwtService.sign({}, {
                secret: jwtConstants.refreshSecret,
                expiresIn: '14d',
            }),
        };
    }

    public async passwordRecovery(email: string): Promise<void> {
        const user: User = await this._userService.findByEmail(email);

        if (!user) return;

        user.passwordRecoveryCode = superchargeStrings.random(20);

        await this._userService.update(user);

        await this._mailService.transporter.sendMail({
            from: mailFrom,
            to: email,
            subject: `Password recovery for Angular-CMS`,
            html: `Hello ${user.username},<br>
<br>
You have made a password recovery request and here is your recovery link:<br>
<a href="${this._configService.config.url}/password-recovery?code=${ user.passwordRecoveryCode }">Password recovery</a>
<br><br>
If you not have requested this, please ignore this email and sign back in normally.<br>
<br>
<br>
Since you forgot your password, I would recommand you're using NordPass:<br>
<br>
Since this project is free, I would just offer you to take a look at NordVPN and NordPass, <br>
NordVPN hides your IP adress while surfing in Public.<br>
NordPass lets you generate save passwords and you can't forget those.<br>
<a href="https://ref.nordvpn.com/tLcqBStyILI">Create your NordAccount</a>`,
        });
    }

    public async recoverPassword(password: string, passwordRecoveryCode: string): Promise<void> {
        const user: User = await this._userService.findByPasswordRecoveryCode(passwordRecoveryCode);

        if (!user) throw new BadRequestException('RecoveryCodeInvalid');

        user.password = await bcrypt.hash(password, 10);
        user.passwordRecoveryCode = null;

        await this._userService.update(user);
    }

    public async refreshToken(tokens: JwtTokenDto): Promise<JwtTokenDto> {
        const accessToken: boolean = await this._isAccessTokenValid(tokens.access_token);
        const refreshToken: boolean = await this._isRefreshTokenValid(tokens.refresh_token);

        if (!refreshToken) throw new UnauthorizedException('TokenExpired');
        if ((!accessToken || tokens.forceRefresh) && refreshToken) {
            const user = this._jwtService.decode(tokens.access_token);
            const getUser: User = await this._userService.getById(user.sub);
            const payload: PayloadInterface = {
                username: getUser.username,
                sub: getUser.id,
                role: getUser.role,
            };

            return {
                access_token: this._jwtService.sign(payload),
                refresh_token: tokens.refresh_token,
            };
        }
    }

    private async _checkPassword(hashedPassword: string, password: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private async _isAccessTokenValid(accessToken: string): Promise<boolean> {
        try {
            await this._jwtService.verifyAsync(accessToken, { secret: jwtConstants.secret });

            return true;
        } catch (error) {
            return false;
        }
    }

    private async _isRefreshTokenValid(refreshToken: string): Promise<boolean> {
        try {
            await this._jwtService.verifyAsync(refreshToken, { secret: jwtConstants.refreshSecret });

            return true;
        } catch (error) {
            return false;
        }
    }
}
