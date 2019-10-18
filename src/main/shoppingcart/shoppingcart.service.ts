import { Injectable } from '@nestjs/common';
import * as uniqid from 'uniqid';
import { BaseEntityService } from '../base-entity/base-entity.service';
import { ConnectionService } from '../../utils/connection/connection.service';
import { AddToCartDto, UpdateCartDto } from './Dto/index.dto';
import ApplicationError  from '../../utils/global-error/application-error'


@Injectable()
export class ShoppingcartService extends BaseEntityService {
  constructor(dbExec: ConnectionService) {
    super(dbExec);
  }

  generateCartId() {
    console.log('here')
    return {
      cart_id: uniqid()
    }
  }

  async removeFromCart(item_id: number) {
    await this.dbExec.connect('CALL shopping_cart_remove_product(?)', [item_id]);
    return;
  }

  async addToCart(data: AddToCartDto, cart_id: number): Promise<any> {
    const { product_id, attributes} = data;
    const [[product]] = await this.dbExec.connect('CALL catalog_get_product_details(?)', [product_id]);
    if (!product) {
      return new ApplicationError('Invalid Product Id.', 'USR_02', 400, 'id');
    }
    await this.dbExec.connect('CALL shopping_cart_add_product(?,?,?)', [cart_id, product_id, attributes]);
    return cart_id;
  }

  async updateCartItem(data: UpdateCartDto, item_id: number) {
    const { quantity } = data;
    await this.dbExec.connect('CALL shopping_cart_update(?,?)', [item_id, quantity]);
    const [row] = await this.dbExec.connect('SELECT cart_id FROM shopping_cart WHERE item_id = ?', [item_id]);
    if (!row) {
      return new ApplicationError('Invalid Cart Id.', 'USR_02', 400, 'id');
    }
    return row.cart_id;
  }
}
