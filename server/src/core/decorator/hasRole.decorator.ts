import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../models/enums/role.enum';

export const HasRole = (role: RoleEnum) => SetMetadata('role', role);
