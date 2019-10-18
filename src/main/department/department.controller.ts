import { Controller, Get, Param } from '@nestjs/common';
import { DepartmentService } from './department.service';
import ApplicationError from '../../utils/global-error/application-error';

@Controller('departments')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get()
  async getDepartments(): Promise<any> {
    const departments = await this.departmentService.getAll('CALL catalog_get_departments_list');
    return departments;
  }

  @Get(':department_id')
  async getDepartmentById(@Param('department_id') department_id) {
    const department = await this.departmentService.queryById('CALL catalog_get_department_details(?)', [department_id]);
    if(!department) {
      throw new ApplicationError('No department was found','DEP_02', 404, 'department_id')
    }
    return department;
  }
}