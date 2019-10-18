import { Controller, Get, Query, Param, UseGuards, Post, Body } from "@nestjs/common";
import { ProductService } from "./product.service";
import { GetPagingData } from "../helpers/get-paging-decorator";
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from "../helpers/get-user.decorator";
import { ProductReviewDto } from './Dto/index.dto';
import ApplicationError from "../../utils/global-error/application-error";

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProducts(@GetPagingData() requestQuery) {
    const products = await this.productService.getProducts(requestQuery);
    return products;
  }

  @Get(':product_id')
  async getProduct(@Param('product_id') product_id) {
    const [product] = await this.productService.queryById('CALL catalog_get_product_details(?)', [product_id])
    console.log(product)
    if (!product) {
      return new ApplicationError('Invalid Product Id.', 'USR_02', 400, 'id');
    }
    return product;
  }

  @Get('search')
  async searchProduct(@GetPagingData() requestQuery) {
    const products = await this.productService.searchProduct(requestQuery)
    return products
  }

  @Get('inCategory/:category_id')
  async getProductsByCategory(@Param('category_id') category_id, @GetPagingData() requestQuery) {
    const products = await this.productService.getProductsByCategory(category_id, requestQuery);
    return products;
  }

  @Get('inDepartment/:department_id')
  async getProductByDepartment(@Param('department_id') department_id, @GetPagingData() requestQuery) {
    const products = await this.productService.getProductByDepartment(department_id, requestQuery);
    return products;
  }

  @Get(':product_id/reviews')
  async getProductDetails(@Param('product_id') product_id) {
    const reviews = await this.productService.queryById('CALL catalog_get_product_reviews(?)', [product_id])
    console.log(reviews);
    return reviews;
  }

  @Post(':product_id/reviews')
  @UseGuards(new AuthGuard())
  async addProductReview(@Body() data: ProductReviewDto, @Param('product_id') product_id, @GetUser() user_id) {
    const review = await this.productService.addProductReview(data, product_id, user_id);
    return review;
  }
  
}