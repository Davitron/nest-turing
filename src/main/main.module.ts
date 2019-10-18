import { Module, NestMiddleware, MiddlewareConsumer, HttpModule, RequestMethod } from '@nestjs/common';
import { DepartmentController } from './department/department.controller';
import { DepartmentService } from './department/department.service';
import { UtilsModule } from '../utils/utils.module';
import { ConfigModule } from '../config/config.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { AttributeController } from './attribute/attribute.controller';
import { AttributeService } from './attribute/attribute.service';
import { CustomerService } from './customer/customer.service';
import { CustomerController } from './customer/customer.controller';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { ShippingController } from './shipping/shipping.controller';
import { ShippingService } from './shipping/shipping.service';
import { ShoppingcartService } from './shoppingcart/shoppingcart.service';
import { ShoppingcartController } from './shoppingcart/shoppingcart.controller';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';



@Module({
  controllers: [
    DepartmentController,
    CategoryController,
    AttributeController,
    CustomerController,
    ProductController,
    OrderController,
    ShippingController,
    ShoppingcartController,
    StripeController,
  ],
  providers: [
    DepartmentService,
    CategoryService,
    AttributeService,
    CustomerService,
    ProductService,
    OrderService,
    ShippingService,
    ShoppingcartService,
    StripeService
  ],
  imports: [UtilsModule, ConfigModule, HttpModule],
})
export class MainModule {}
