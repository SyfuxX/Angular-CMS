import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from '../constants/jwt.constants';
import {
    ExtractJwt,
    Strategy,
} from 'passport-jwt';
import { PayloadInterface } from '../models/interfaces/payload.interface';
import { UserInterface } from '../models/interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    public async validate(payload: PayloadInterface): Promise<UserInterface> {
        return {
            id: payload.sub,
            username: payload.username,
            role: payload.role,
        };
    }
}
