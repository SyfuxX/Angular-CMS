import { RoleEnum } from '../enums/role.enum';

export interface UserInterface {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    username: string;
    role: RoleEnum;
}
