export class StripeChargeDto {
  readonly order_id: string;
  readonly amount: any;
  readonly stripeToken: string;
  readonly description: string;
  readonly currency: string;
};





