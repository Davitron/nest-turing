import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '../base-entity/base-entity.service';
import { ConnectionService } from '../../utils/connection/connection.service';

@Injectable()
export class CategoryService extends BaseEntityService {
  constructor(dbExec: ConnectionService) {
    super(dbExec)
  }

  async getCategories(): Promise<any> {
    const [rows] = await this.dbExec.connect('CALL catalog_get_categories');
    const [{ count }] = await this.dbExec.connect('SELECT count(*) AS count FROM category');
    return { count, rows }
  }
}