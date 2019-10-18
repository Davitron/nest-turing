import { Controller, Get, Param, Delete, Post, Put, Body } from '@nestjs/common';
import { ShoppingcartService } from './shoppingcart.service';
import { AddToCartDto, UpdateCartDto } from './Dto/index.dto';

@Controller('shoppingcarts')
export class ShoppingcartController {
  constructor(private shopingCartService: ShoppingcartService) {}

  @Get('generateUniqueId')
  async generateCartId() {
    const cart_id = await this.shopingCartService.generateCartId();
    return cart_id;
  }

  @Get(':cart_id')
  async getAllInCart(@Param('cart_id') cart_id) {
    const rows = await this.shopingCartService.queryById('CALL shopping_cart_get_products(?)', [cart_id]);
    return rows;
  }

  @Get('moveToCart/:item_id')
  async moveToCart(@Param('item_id') item_id) {
    await this.shopingCartService.queryById('CALL shopping_cart_move_product_to_cart(?)', [item_id]);
    return;
  }

  @Get('saveForLater/:item_id')
  async saveForLater(@Param('item_id') item_id) {
    const [rows] = await this.shopingCartService.queryById('CALL shopping_cart_save_product_for_later(?)', [item_id]);
    return rows;
  }

  @Get('totalAmount/:cart_id')
  async getTotalAmount(@Param('cart_id') cart_id) {
    const [rows] = await this.shopingCartService.queryById('CALL shopping_cart_get_total_amount(?)', [cart_id]);
    return rows;
  }

  @Get('getSaved/:cart_id')
  async getAllSaved(@Param('cart_id') cart_id) {
    const rows = await this.shopingCartService.queryById('CALL shopping_cart_get_saved_products(?)', [cart_id]);
    console.log(rows)
    return rows;
  }
  
  @Delete('empty/:cart_id')
  async emptyCart(@Param('cart_id') cart_id) {
    await this.shopingCartService.queryById('CALL shopping_cart_empty(?)', [cart_id]);
    return;
  }

  @Delete('removeProduct/:item_id')
  async removeFromCart(@Param('item_id') item_id) {
   await this.shopingCartService.removeFromCart(item_id)
    return;
  }

  @Post('add/:cart_id')
  async addToCart(@Body() data: AddToCartDto, @Param('cart_id') cart_id) {
    console.log('POST')
    const cartId = await this.shopingCartService.addToCart(data, cart_id);
    const [cart] = await this.shopingCartService.queryById(
      'CALL shopping_cart_get_products(?)',
      [cartId]
    );
    return cart;
  }

  @Put('update/:item_id')
  async updateCartItem(@Body() data: UpdateCartDto, @Param('item_id') item_id) {
    const cart_id = await this.shopingCartService.updateCartItem(data, item_id);
    const rows = await this.getAllInCart(cart_id);
    return rows
  }


}
