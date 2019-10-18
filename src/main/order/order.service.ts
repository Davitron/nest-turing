import { Injectable } from "@nestjs/common";
import { BaseEntityService } from "../base-entity/base-entity.service";
import { ConnectionService } from '../../utils/connection/connection.service';
import { CreateOrderDto } from "./Dto/index.dto";
import ApplicationError from '../../utils/global-error/application-error';


@Injectable()
export class OrderService extends BaseEntityService {
  constructor(dbExec: ConnectionService) {
    super(dbExec);
  }

  async createOrder(data: CreateOrderDto, user_id: number) {
    const { shipping_id, tax_id, cart_id}  = data;
    const [cartItems] = await this.dbExec.connect('CALL shopping_cart_get_products(?)', [cart_id]);
    const [tax] = await this.dbExec.connect('SELECT * From Tax WHERE tax_id = ?', [tax_id]);
    const [[shipping]] = await this.dbExec.connect('CALL orders_get_shipping_info(?)', [shipping_id]);

    if (cartItems.length === 0) {
      return new ApplicationError('Cart is empty', 'USR_02', 400, 'id');
    }
    if (!tax) {
      return new ApplicationError('Invalid Tax Id.', 'USR_02', 400, 'id');
    }
    if (!shipping) {
      return new ApplicationError('Invalid Shipping Id.', 'USR_02', 400, 'id');
    }

    const [[orderId]] = await this.dbExec.connect(
      'CALL shopping_cart_create_order(?,?,?,?)',
      [cart_id, user_id, shipping_id, tax_id]
    );

    return orderId;
  }
}