import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '../base-entity/base-entity.service';
import { ConnectionService } from '../../utils/connection/connection.service';

@Injectable()
export class DepartmentService extends BaseEntityService {
  constructor(dbExec: ConnectionService) {
    super(dbExec)
  }
}