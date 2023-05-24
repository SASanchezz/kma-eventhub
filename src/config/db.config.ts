import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Users } from "src/modules/users/users.entity";

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.IS_DOCKERED ? 'db' : 'localhost',
  port: 3306,
  username: 'root',
  password: 'myrootpassword',
  database: 'app',
  entities: [Users],
  synchronize: true,
}
