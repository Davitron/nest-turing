export class CreateOrderDto {
  readonly cart_id: string;
  readonly shipping_id: number;
  readonly tax_id: number;
}
