export class UpdateCustomerDto {
  readonly name: string;
  readonly email: string;
  readonly password?: string;
  readonly day_phone?: string;
  readonly eve_phone?: string;
  readonly mob_phone?: string;
}

export class NewCustomerDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export class LoginCustomerDto {
  readonly email: string;
  readonly password: string;
}

export class LoginCustomerFBDto {
  readonly access_token: string;
}

export class CustomerAddressDto {
  readonly address_1: string;
  readonly address_2?: string;
  readonly city: string;
  readonly region: string;
  readonly postal_code: string;
  readonly country: string;
  readonly shipping_region_id: number;
}

export class CustomerCreditCard {
  readonly credit_card: string;
}