import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { RestEntity } from './rest.entity';
import { RestService } from './rest.service';

@Controller()
export class RestController<T extends RestEntity> {
    constructor(
        private readonly _restService: RestService<T>,
    ) {
    }

    @Get()
    public async getById(@Param('id') id: number): Promise<T> {
        return this._restService.getById(id);
    }

    @Get()
    public async getAll(): Promise<T[]> {
        return this._restService.getAll();
    }

    @Post()
    public async create(@Body() entity: T): Promise<T> {
        return this._restService.create(entity);
    }

    @Put()
    public async update(@Body() entity: T): Promise<T> {
        return this._restService.update(entity);
    }

    @Delete(':id')
    public async delete(@Param('id') id: number): Promise<DeleteResult> {
        return this._restService.delete(id);
    }
}
