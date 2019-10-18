import { Controller, Get, Param } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('regions')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Get()
  async getRegions(): Promise<any> {
    const regions = await this.shippingService.getAll('CALL customer_get_shipping_regions')
    return regions;
  }

  @Get(':shipping_region_id')
  async getRegionById(@Param('shipping_region_id') shipping_region_id: number): Promise<any> {
    const region = await this.shippingService.queryById('CALL orders_get_shipping_info(?)', [shipping_region_id])
    return region;
  }
}
