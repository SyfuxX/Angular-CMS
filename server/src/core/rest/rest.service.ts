import { Injectable } from '@nestjs/common';
import {
    DeleteResult,
    Repository,
} from 'typeorm';
import { RestEntity } from './rest.entity';

@Injectable()
export class RestService<T extends RestEntity> {
    public relations: string[];

    constructor(
        private _repository: Repository<T>,
    ) {
    }

    public async create(entity: T): Promise<T> {
        return await this._repository.save(entity);
    }

    public async getById(id: number): Promise<T> {
        return await this._repository.findOne({
            // @ts-ignore
            where: { id },
            relations: this.relations,
        });
    }

    public async getAll(): Promise<T[]> {
        return await this._repository.find({
            relations: this.relations,
        });
    }

    public async update(entity: T): Promise<T> {
        const updatedEntity = await this._repository.save(entity);

        return await this.getById(updatedEntity.id);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return await this._repository.delete(id);
    }
}
