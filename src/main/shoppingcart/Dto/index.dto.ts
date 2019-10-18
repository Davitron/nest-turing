export class AddToCartDto {
  readonly product_id: number;
  readonly attributes: string;
}

export class UpdateCartDto {
  readonly quantity: number;
}