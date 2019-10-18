import { Injectable } from '@nestjs/common';
import { BaseEntityService, Queries } from '../base-entity/base-entity.service';
import { ConnectionService } from '../../utils/connection/connection.service';
import { PagedQuery, PagingResult } from '../../paging/pagination.service';
import { ProductReviewDto } from './Dto/index.dto';

@Injectable()
export class ProductService extends BaseEntityService {
  constructor(dbExec: ConnectionService) {
    super(dbExec);
  }

  async getProducts(paginRequest: PagedQuery) {
    const { description_length, limit, offset } = paginRequest;
    const [rows] = await this.dbExec.connect('CALL catalog_get_products_on_catalog(?,?,?)', [description_length, limit, offset]);
    const [[count]] = await this.dbExec.connect('CALL catalog_count_products_on_catalog');
    console.log(count)
    const data = {
      count: count.products_on_catalog_count,
      rows
    }
    const pagination = new PagingResult(data, paginRequest)
    return {
      paginationMeta: pagination.getPagingMeta(),
      rows
    }
  }

  async searchProduct(pagingData: PagedQuery): Promise<any> {
    const { query_string, all_words, description_length, limit, offset } = pagingData;
    const [rows] = await this.dbExec.connect(
      'CALL catalog_search(?,?,?,?,?)',
      [query_string, all_words, description_length, limit, offset]
    );
    const [[count]] = await this.dbExec.connect(
      'CALL catalog_count_search_result(?,?)',
      [query_string, all_words]
    );
    return { count: count['count(*)'], rows };
  }

  async getProductsByCategory(category_id: number, pagingData: PagedQuery): Promise<any> {
    const { description_length, limit, offset } = pagingData;
    const [rows] = await this.dbExec.connect(
      'CALL catalog_get_products_in_category(?,?,?,?)',
      [category_id, description_length, limit, offset]
    );
  
    const [[count]] = await this.dbExec.connect(
      'CALL catalog_count_products_in_category(?)',
      [category_id]
    );
    console.log(count.categories_count)
    return { count: count.categories_count, rows };
  }

  async getProductByDepartment(department_id: number, pagingData: PagedQuery): Promise<any> {
    const { description_length, limit, offset } = pagingData;
    const [rows] = await this.dbExec.connect(
      'CALL catalog_get_products_on_department(?,?,?,?)',
      [department_id, description_length, limit, offset]
    );
    const [[count]] = await this.dbExec.connect(
      'CALL catalog_count_products_on_department(?)',
      [department_id]
    );

    return {
      count: count.products_on_department_count,
      rows
    }
  }

  async addProductReview(body: ProductReviewDto, product_id: number, user_id: number): Promise<any> {
    const { review, rating } = body;
    const row = await this.dbExec.connect(
      'SELECT review_id FROM review WHERE product_id = ? AND customer_id = ?',
      [product_id, user_id]
    );
    if(row.length === 0) {
      await this.dbExec.connect('CALL catalog_create_product_review(?,?,?,?)',
      [user_id, product_id, review, rating]);
    } else {
      await this.dbExec.connect(
        'UPDATE review SET review = ?, rating = ? WHERE product_id = ? AND customer_id = ?',
        [review, rating, product_id, user_id]
      );
    }

    const reviews = await this.queryById('CALL catalog_get_product_reviews(?)', [product_id])
    return reviews;
  }
}