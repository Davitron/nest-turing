import { Injectable } from '@nestjs/common';
import * as Stripe from 'stripe';
import { ConnectionService } from '../../utils/connection/connection.service';
import { ConfigService } from '../../config/config.service';
import { StripeChargeDto } from './Dto/index.dto'
import { BaseEntityService } from '../base-entity/base-entity.service';
import ApplicationError from '../../utils/global-error/application-error';



@Injectable()
export class StripeService extends BaseEntityService {
  stripe: any
  constructor(dbExec: ConnectionService, private configService: ConfigService) {
    super(dbExec);
    this.stripe = new Stripe(this.configService.get('STRIPE_KEY'));
  }

  async createCharge(charge: StripeChargeDto ) {
    const {
      stripeToken: source,
      order_id,
      description,
      amount,
      currency = 'USD'
    } = charge;
    let newCharge;
    const [[order]] = await this.dbExec.connect('CALL orders_get_order_info(?)', [
      order_id,
    ])

    if (!order) {
      return new ApplicationError('Invalid Order Id.', 'USR_02', 400, 'id');
    }

    try {
      newCharge = await this.stripe.charges.create({
        amount: parseFloat(amount),
        currency,
        description,
        source,
        metadata: {order_id}
      });
    } catch (error) {
      return new ApplicationError(error.message, 'USR_02', 400, 'charge')
    }
    return newCharge;
  }

  // async syncCharge(body: any, config: any) {
  //   const { rawBody, headers} = config;
  //   const signature = headers['stripe-signature'];
  //   const secret = this.configService.get('STRIPE_WEBHOOK_TOKEN');
  //   let event;

  //   try {
  //     event = await this.stripe.webhooks.constructEvent(rawBody, signature, secret)
  //   } catch(error) {
  //     return new ApplicationError(error.message, null, 500, 'stripe')
  //   }

  //   switch (event.type) {
  //     case 'charge.succeeded':
  //       console.log(event.object);
  //       break;
  //     case 'charge.refunded':
  //       console.log(event.object);
  //       break;
  //   }
  // }
}
