import {Injectable} from '@nestjs/common';
import {MysqlConnector} from "./mysql_orm";

@Injectable()
export class Infrastructure  {
    public mysql: MysqlConnector;
        constructor(
           
        ){
            this.mysql = new MysqlConnector();
        }
};