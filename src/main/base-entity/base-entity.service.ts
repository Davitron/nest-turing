import { ConnectionService } from '../../utils/connection/connection.service';


export interface Queries {
  rowsQuery: string,
  rowsOptions?: string,
  countQuery: string,
  countOptions?: string,
}

export abstract class BaseEntityService {
  constructor(protected dbExec: ConnectionService) {}

  async getAll(query): Promise<any> {
    const [rows] = await this.dbExec.connect(query);
    return rows;
  }

  async queryById(query: string, options: Array<any>):Promise<any> {
    const [rows] = await this.dbExec.connect(query, [options]);
    if(!rows || rows.length < 1) return null;
    return rows;
  }
}

// interface IPageMeta {
//   totalPages: number;
//   limit: number;
// }

// class PagedResult<T> {
//   data: T[];
//   pageMeta: IPageMeta
// }

// interface IPagedQuery {
//   limit: number,
//   page: number
// }

// getPagedResult(options: IPagedQuery) {
//   return PagedResult
// }