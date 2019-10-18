import { Injectable, Controller, Get, Param } from '@nestjs/common'
import { AttributeService } from './attribute.service';
import ApplicationError from '../../utils/global-error/application-error';

@Controller('attributes')
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @Get()
  async getAttributes(): Promise<any> {
    const attributes = await this.attributeService.getAll('CALL catalog_get_attributes');
    return attributes;
  }

  @Get(':attribute_id')
  async getAttributesById(@Param('attribute_id') attribute_id): Promise<any> {
    const attribute = await this.attributeService.queryById('CALL catalog_get_attribute_details(?)', [attribute_id]);
    if(!attribute) {
      throw new ApplicationError('No attribute found', null, 404, 'attribute_id')
    }
    return attribute;
  }

  @Get('values/:attribute_id')
  async getAttributeValues(@Param('attribute_id') attribute_id): Promise<any> {
    const attributeValues = await this.attributeService.queryById('CALL catalog_get_attribute_values(?)', [attribute_id]);
    if(!attributeValues) {
      throw new ApplicationError('No attribute values found', null, 404, 'attribute_id')
    }
    return attributeValues;
  }

  @Get('inProduct/:product_id')
  async getAttributesByProductId(@Param('product_id') product_id): Promise<any> {
    const attributes = await this.attributeService.queryById('CALL catalog_get_product_attributes(?)', product_id);
    if(!attributes) {
      throw new ApplicationError(
        'No attribute matches the specifies product',
        null,
        404,
        'product_id'
      );
    }

    return attributes;
  }
}