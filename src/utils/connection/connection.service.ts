import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql';
import ApplicationError from  '../global-error/application-error';
import { ConfigService } from '../../config/config.service';


@Injectable()
export class ConnectionService {
  constructor(private config: ConfigService) {}
  connect(query: string, values: Array<any> = [] ): Promise<any> {
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: this.config.get('DATABASE_HOST'),
      user: this.config.get('DATABASE_USER'),
      password: this.config.get('DATABASE_PASS'),
      database: this.config.get('DATABASE_NAME'),
      insecureAuth: true,
    });
    return new Promise<any>((resolve, reject) => {
      try {
        return pool.getConnection((err, connection) => {
          if(err) throw err;
  
          return connection.query(query, values, (error, rows) => {
            connection.release();
            if (error) throw error;
            return resolve(rows);
          });
        });
      } catch (error) {
        return reject( new ApplicationError('Database Error', 'DB_01', 500, null))
      }
    })
  }
}
