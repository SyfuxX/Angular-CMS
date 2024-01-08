import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        MailService,
    ],
    exports: [
        UserService,
        MailService,
    ],
})
export class UserModule {
}
