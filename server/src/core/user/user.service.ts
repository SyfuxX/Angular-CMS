import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '../../config/environment/config.service';
import { mailFrom } from '../../config/mail.config';
import { MailService } from '../mail/mail.service';
import { RestService } from '../rest/rest.service';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService extends RestService<User> {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
        private readonly _mailService: MailService,
        private readonly _configService: ConfigService,
    ) {
        super(_userRepository);
    }

    public async findByUsername(username: string, sanitize = true): Promise<User> {
        const user: User = await this._userRepository.findOne({
            where: { username },
            relations: this.relations,
        });

        if (!user) return null;
        return sanitize ? this._sanitizeUser(user) : user;
    }

    public async findByEmail(email: string): Promise<User> {
        const user: User = await this._userRepository.findOne({
            where: { email },
            relations: this.relations,
        });

        if (!user) return null;
        return this._sanitizeUser(user);
    }

    public async findByActivationCode(activationCode: string, id: number): Promise<User> {
        return await this._userRepository.findOne({
            where: { activationCode, id  },
            relations: this.relations,
        });
    }

    public async findByPasswordRecoveryCode(passwordRecoveryCode: string): Promise<User> {
        const user: User = await this._userRepository.findOne({
            where: { passwordRecoveryCode  },
            relations: this.relations,
        });

        return user ? this._sanitizeUser(user) : null;
    }

    public async create(entity: User): Promise<User> {
        const userExists: User = await this.findByUsername(entity.username);
        const emailExists: User = await this.findByEmail(entity.email);

        if (userExists || emailExists) throw new BadRequestException('UsernameOrEmailTaken');

        entity.password = await bcrypt.hash(entity.password, 10);

        const createdUser: User = await super.create(entity);

        await this._mailService.transporter.sendMail({
            from: mailFrom,
            to: createdUser.email,
            subject: `Welcome ${ createdUser.username }, to Angular-CMS`,
            html: `Your account has been created successfully.<br>
<br>
To activate your account, please use the link below:<br>
<a href="${this._configService.config.url}/cms?activate=${ createdUser.activationCode }">Activate account</a>
<br><br>
Have fun and thank you for using Angular-CMS Template!`,
        });

        return this._sanitizeUser(createdUser);
    }

    public async getById(id: number): Promise<User> {
        const user: User = await super.getById(id);

        return user ? this._sanitizeUser(user) : null;
    }

    public async getAll(): Promise<User[]> {
        const userList: User[] = await super.getAll();

        userList.forEach((user: User) => this._sanitizeUser(user));

        return userList;
    }

    public async update(entity: User): Promise<User> {
        const user: User = await super.update(entity);

        return user ? this._sanitizeUser(user) : null;
    }

    public async accountActivation(activationCode: string, id: number): Promise<void> {
        const checkActivationCode: User = await this.findByActivationCode(activationCode, id);

        if (!checkActivationCode) throw new BadRequestException('ActivationCodeNotValid');
        if (checkActivationCode.isActivated) throw new BadRequestException('AccountAlreadyActivated');

        await super.update({
            ...checkActivationCode,
            isActivated: true,
            activationCode: null,
        });
    }

    private _sanitizeUser(user: User): User {
        delete user.passwordRecoveryCode;
        delete user.password;
        delete user.activationCode;

        return user;
    }
}
