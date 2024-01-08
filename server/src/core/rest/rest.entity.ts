import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class RestEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({
        type: 'timestamp',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    public updatedAt: Date;
}
