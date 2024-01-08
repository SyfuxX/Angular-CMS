import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';
import { UserInterface } from '../models/interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly _authService: AuthService,
    ) {
        super();
    }

    public async validate(username: string, password: string): Promise<UserInterface> {
        const user: UserInterface = await this._authService.validateUser(username, password);

        if (!user) throw new UnauthorizedException();

        return user;
    }
}
