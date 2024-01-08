import { Column, Entity, Generated } from 'typeorm';
import { RoleEnum } from '../models/enums/role.enum';
import { RestEntity } from '../rest/rest.entity';

@Entity()
export class User extends RestEntity {
    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
        unique: true,
    })
    public username: string;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: false,
    })
    public password: string;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    public firstname: string;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    public lastname: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
        unique: true,
    })
    public email: string;

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.User,
    })
    public role: RoleEnum;

    @Column({
        nullable: true,
        type: 'varchar',
    })
    public passwordRecoveryCode: string;

    @Column({
        nullable: true,
    })
    @Generated('uuid')
    public activationCode: string;

    @Column({
        type: 'boolean',
        default: false,
    })
    public isActivated: boolean;
}
