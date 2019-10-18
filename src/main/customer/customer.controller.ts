import { Controller, Get, Param, Post, Body, UseGuards, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { NewCustomerDto, LoginCustomerDto, LoginCustomerFBDto, CustomerAddressDto, UpdateCustomerDto, CustomerCreditCard } from './Dto';
import { GetUser } from '../helpers/get-user.decorator'
import { AuthGuard } from '../guards/auth.guard'
import { ConfigService } from '../../config/config.service';
import { ConnectionService } from '../../utils/connection/connection.service';
import bodyParser = require('body-parser');

@Controller('customers')
export class CustomerController {
  config: any
  constructor(
    private customerService: CustomerService,
  ) {}

  @Get(':user_id')
  async getCustomerById(@Param('user_id') user_id): Promise<any> {
    const [ user ]: any = await this.customerService.queryById('CALL customer_get_customer(?)', [user_id]);
    return user;
  }
  
  @Post()
  async createCustomer(@Body() data: NewCustomerDto) {
    const payload = await this.customerService.createCustomer(data)
    return payload;
  }
  
  @Post('login')
  async loginCustomer(@Body() data: LoginCustomerDto) {
    const payload = await this.customerService.loginCustomer(data);
    return payload;
  }

  @Post('facebook')
  async loginCustomerByFacebook(@Body() data: LoginCustomerFBDto) {
    const payload = await this.customerService.loginCustomerByFacebook(data)
    return payload;
  }

  @Put('address')
  @UseGuards(new AuthGuard())
  async updateCustomerAddress(@Body() data: CustomerAddressDto, @GetUser() user: number) {
    const addressUpdated = await this.customerService.updateCustomerAddress(data, user);
    if(addressUpdated === true) {
      const payload = await this.customerService.queryById('CALL customer_get_customer(?)', [user])
      return payload;
    }
    return addressUpdated
  }

  @Put()
  @UseGuards(new AuthGuard())
  async updateCustomerInfo(@Body() data: UpdateCustomerDto, @GetUser() user: number) {
    const infoUpdated = await this.customerService.updateCustomerInfo(user, data);
    if(infoUpdated === true) {
      const payload = await this.customerService.queryById('CALL customer_get_customer(?)', [user])
      return payload;
    }
    return infoUpdated;
  }


  @Put('creditcard')
  @UseGuards(new AuthGuard())
  async updateCustomerCard(@Body() data: CustomerCreditCard, @GetUser() user: number) {
    const cardUpdated = await this.customerService.updateCustomerCard(data, user)
    if(cardUpdated === true) {
      const payload = await this.customerService.queryById('CALL customer_get_customer(?)', [user])
      return payload;
    }
    return cardUpdated;
  }

}
