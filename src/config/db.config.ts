import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { StudentOrganisations } from "src/modules/student-organisations/student-organisations.entity";
import { Users } from "src/modules/users/users.entity";
import { remoteDb } from "./remote-db.config";

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: remoteDb.HOSTNAME, //process.env.NODE_ENV == 'prod' ? remoteDb.HOSTNAME : process.env.IS_DOCKERED ? 'db' : 'localhost',
  port: 3306,
  username: remoteDb.USERNAME, //process.env.NODE_ENV == 'prod' ? remoteDb.USERNAME : 'root',
  password: remoteDb.PASSWORD, //process.env.NODE_ENV == 'prod' ? remoteDb.PASSWORD : 'myrootpassword',
  database: remoteDb.DATABASE,
  entities: [Users, StudentOrganisations],
  synchronize: true,
}
