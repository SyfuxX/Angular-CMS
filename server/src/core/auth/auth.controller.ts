import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { HasRole } from '../decorator/hasRole.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { JwtTokenDto } from '../models/dto/jwt.dto';
import { RoleEnum } from '../models/enums/role.enum';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly _authService: AuthService,
        private readonly _userService: UserService,
    ) {
    }

    @Recaptcha({ action: 'Login' })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(@Request() request: any): Promise<JwtTokenDto> {
        return this._authService.login(request.user);
    }

    @Recaptcha({ action: 'Register' })
    @Post('register')
    public async register(@Body() body: User): Promise<User> {
        return this._userService.create(body as User);
    }

    @Post('password-recovery')
    public async passwordRecovery(@Body() body: {
        email: string;
    }): Promise<void> {
        return this._authService.passwordRecovery(body.email);
    }

    @Post('recover-password')
    public async recoverPassword(@Body() body: {
        password: string,
        passwordRecoveryCode: string,
    }): Promise<void> {
        return this._authService.recoverPassword(body.password, body.passwordRecoveryCode);
    }

    @UseGuards(RoleGuard)
    @HasRole(RoleEnum.User)
    @Post('refresh-token')
    public async refreshToken(@Body() body: JwtTokenDto): Promise<JwtTokenDto> {
        return this._authService.refreshToken(body);
    }
}
