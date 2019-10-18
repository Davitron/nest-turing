import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateOrderDto } from './Dto/index.dto';
import { GetUser } from '../helpers/get-user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(new AuthGuard())
  async createOrder(@Body() data: CreateOrderDto, @GetUser() user_id: number) {
    const order_id = await this.orderService.createOrder(data, user_id);
    return order_id;
  }

  @Get(':order_id')
  @UseGuards(new AuthGuard())
  async getOrderById(@Param('order_id') order_id): Promise<any> {
    const [rows] = await this.orderService.queryById('CALL orders_get_order_details(?)', [order_id])
    return rows;
  }

  @Get('inCustomer')
  @UseGuards(new AuthGuard())
  async getOrderByCustomer(@GetUser() user_id: number) {
    const [rows] = await this.orderService.queryById('CALL orders_get_by_customer_id(?)', [user_id])
    return rows;
  }

  @Get('shortDetail/:order_id')
  async getOrderInfoById(@Param('order_id') order_id): Promise<any> {
    const [[rows]] = await this.orderService.queryById('CALL orders_get_order_info(?)', [order_id])
    return rows;
  }
}