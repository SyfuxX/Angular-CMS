import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { HasRole } from '../decorator/hasRole.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { RoleEnum } from '../models/enums/role.enum';
import { ProtectedRestController } from '../rest/restProtected.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController extends ProtectedRestController<User> {
    constructor(
        private readonly _userService: UserService,
    ) {
        super(_userService);
    }

    @Get()
    @HasRole(RoleEnum.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async getAll(): Promise<User[]> {
        return super.getAll();
    }

    @Put()
    @HasRole(RoleEnum.User)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async update(entity: User): Promise<User> {
        const user: User = await super.getById(entity.id);

        if (user.role !== entity.role) delete entity.role;

        return super.update(entity);
    }

    @Put('role')
    @HasRole(RoleEnum.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async updateRole(@Body() entity: User): Promise<User> {
        return super.update(entity);
    }

    @Get(':id/:activationCode')
    @HasRole(RoleEnum.User)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async verifyEmail(
        @Param('id') id: number,
        @Param('activationCode') activationCode: string,
    ): Promise<void> {
        return await this._userService.accountActivation(activationCode, Number(id));
    }
}
