import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { HasRole } from '../decorator/hasRole.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { RoleEnum } from '../models/enums/role.enum';
import { RestEntity } from './rest.entity';
import { RestService } from './rest.service';

@Controller()
export class ProtectedRestController<T extends RestEntity> {
    constructor(
        private readonly _restService: RestService<T>,
    ) {
    }

    @Get(':id')
    @HasRole(RoleEnum.User)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async getById(@Param('id') id: number): Promise<T> {
        return this._restService.getById(id);
    }

    @Get()
    @HasRole(RoleEnum.User)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async getAll(): Promise<T[]> {
        return this._restService.getAll();
    }

    @Post()
    @HasRole(RoleEnum.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async create(@Body() entity: T): Promise<T> {
        return this._restService.create(entity);
    }

    @Put()
    @HasRole(RoleEnum.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async update(@Body() entity: T): Promise<T> {
        return this._restService.update(entity);
    }

    @Delete(':id')
    @HasRole(RoleEnum.Admin)
    @UseGuards(JwtAuthGuard, RoleGuard)
    public async delete(@Param('id') id: number): Promise<DeleteResult> {
        return this._restService.delete(id);
    }
}
