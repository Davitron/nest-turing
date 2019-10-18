import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeChargeDto } from './Dto/index.dto';


@Controller('stripe')
export class StripeController {
  constructor( private stripeService: StripeService) {}

  @Post('charge')
  async createCharge(@Body() charge: StripeChargeDto) {
    const newCharge = await this.stripeService.createCharge(charge);
    return newCharge;
  }
}
