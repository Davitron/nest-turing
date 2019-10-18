import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import ApplicationError from '../..//utils/global-error/application-error';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<any> {
    const categories = await this.categoryService.getCategories();
    return categories;
  }

  @Get(':category_id')
  async getDepartmentById(@Param('category_id') category_id): Promise<any> {
    const category = await this.categoryService.queryById('CALL catalog_get_category_details(?)', [category_id]);
    if(!category) {
      throw new ApplicationError('No category was found', 'CAT_01', 404, 'category_id')
    }
    return category;
  }

  @Get('inProduct/:product_id')
  async getProductCategories(@Param('product_id') product_id): Promise<any> {
    const category = await this.categoryService.queryById('CALL catalog_get_product_locations(?)', [product_id]);
    if(!category) {
      throw new ApplicationError('No category was found', 'CAT_01', 404, 'product_id')
    }
    return category;
  }

  @Get('inDepartment/:department_id')
  async getDepartmentCategories(@Param('department_id') department_id): Promise<any> {
    const [rows] = await this.categoryService.queryById('CALL catalog_get_categories_list(?)', [department_id]);
    return rows;
  }
}