import { RoleEnum } from '../enums/role.enum';

export interface PayloadInterface {
    username: string;
    sub: number;
    role: RoleEnum;
}
