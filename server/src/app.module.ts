import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { googleConfig } from './config/google-example.config';
import { typeOrmConfig } from './config/typeORM.config';
import { AuthModule } from './core/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        GoogleRecaptchaModule.forRoot({
            secretKey: googleConfig.secretKey,
            response: req => req.body.recaptchaToken,
            actions: ['Login', 'Register'],
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([
            // Add Entities here...
        ]),
    ],
    controllers: [
        AppController,
        // Add Entity Controller here...
    ],
    providers: [
        AppService,
        // Add Entity Services here...
    ],
})
export class AppModule {
}
