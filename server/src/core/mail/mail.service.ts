import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailConfig } from '../../config/mail.config';

@Injectable()
export class MailService {
    public transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: 587,
        secure: true,
        requireTLS: true,
        auth: {
            user: mailConfig.user,
            pass: mailConfig.pass,
        },
        logger: false,
    });
}
