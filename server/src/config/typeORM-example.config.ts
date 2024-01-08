import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql', // Currently just mysql2 installed
    host: 'db_host',
    port: 3306,
    username: 'db_user',
    password: 'db_pass',
    database: 'db_name',
    entities: [__dirname + '../../**/*.entity.{js,ts}'],
    synchronize: true,
};
