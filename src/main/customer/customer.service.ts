import { Injectable, HttpService } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import * as axios from 'axios';
import { BaseEntityService } from '../base-entity/base-entity.service';
import { ConnectionService } from '../../utils/connection/connection.service';
import { UpdateCustomerDto, NewCustomerDto, LoginCustomerDto, LoginCustomerFBDto, CustomerAddressDto, CustomerCreditCard } from './Dto';
import ApplicationError from '../../utils/global-error/application-error';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class CustomerService extends BaseEntityService {
  secret: string
  constructor(
    dbExec: ConnectionService,
    private configService: ConfigService,
    private httpService: HttpService
  ) {
    super(dbExec)
    this.secret = this.configService.get('JWT_SECRET')
  }

  async updateCustomerInfo(user_id: number, data: UpdateCustomerDto): Promise<boolean> {
    const [[customer]] = await this.dbExec.connect('CALL customer_get_customer(?)', [user_id]);
    const {
      name, email,
      password = customer.password,
      day_phone = customer.day_phone,
      eve_phone = customer.eve_phone,
      mob_phone = customer.mob_phone,
    } = data;

    console.log(data);

    const hashedPassword = (data.password) ? MD5(password).toString() : password;
    const rows: any = this.dbExec.connect('CALL customer_update_account(?,?,?,?,?,?,?)',
      [user_id, name, email, hashedPassword, day_phone, eve_phone, mob_phone]
    )

    return (rows.affectedRows === 0)? false : true;
  }


  async createCustomer(data: NewCustomerDto) {
    const {
      email,
      name,
      password
    } = data;

    const [rows]: any = await this.dbExec.connect('CALL customer_get_login_info(?)', [email]);
    if (rows.length === 1) {
      return new ApplicationError('Email already exists.', 'USR_04', 400, 'email');
    }

    const [[ row ]]: any = await this.dbExec.connect('CALL customer_add(?,?,?)',
    [name, email, MD5(password).toString()]);

    if (row) {
      const customer_id = row['LAST_INSERT_ID()'];
      const accessToken = jwt.sign({ customer_id }, this.secret, { expiresIn: '24h' });
      const schema = await this.dbExec.connect('CALL customer_get_customer(?)', [customer_id])
      return {
        customer: { schema },
        accessToken
      }
    }
    return new ApplicationError('Cannot Create Account.', 'USR_02', 400, 'credientials')
  }

  async loginCustomer(data: LoginCustomerDto) {
    const { email, password } = data; 
    const [rows]: any = await this.dbExec.connect('SELECT * FROM customer WHERE email = ?', [email]);
    if (rows && MD5(password).toString() === rows.password) {
      const accessToken = jwt.sign({ customer_id: rows.customer_id }, this.secret, { expiresIn: '24h' })
      return {
        customer: { schema: rows },
        accessToken
      }
    }
    return new ApplicationError('Invalid Login credentials.', 'AUT_02', 401, 'credientials')
  }

  async loginCustomerByFacebook(data: LoginCustomerFBDto) {
    console.log(data);
    const { access_token } = data;
    let accessToken;
    const { data: fbData } = await this.httpService
      .get(`https://graph.facebook.com/me/?access_token=${access_token}&fields=name,email`)
      .toPromise();
    
      if (fbData && fbData.email) {
        const [rows]: any = await this.dbExec.connect('SELECT * FROM customer WHERE email = ?', [fbData.email]);
        if (rows) {
          accessToken = jwt.sign({ customer_id: rows.customer_id }, this.secret, { expiresIn: '24h' })
          return { customer: { schema: rows }, accessToken, expiresIn: '24h' }
        }
        const [[ row ]]: any = await this.dbExec.connect('CALL customer_add(?,?,?)',
        [fbData.name, fbData.email, '']);
        if (row) {
          const customer_id = row['LAST_INSERT_ID()'];
          accessToken = jwt.sign({ customer_id }, this.secret, );
          const [schema] = await this.dbExec.connect('CALL customer_get_customer(?)', [customer_id]);
          return { customer: { schema }, accessToken, expiresIn: '24h' };
        }
      }
      return new ApplicationError('Invalid Login credentials.', 'AUT_02', 401, 'email')
  }

  async updateCustomerAddress(data: CustomerAddressDto, user_id: number): Promise<true | ApplicationError> {
    const {
      address_1, address_2, city, region, postal_code, country, shipping_region_id,
    } = data;
    let [rows]: any = await this.dbExec.connect('CALL orders_get_shipping_info(?)', [shipping_region_id]);
    if (rows.length === 0) {
      return new ApplicationError('Region with ID does not exist.', 'USR_02', 400, 'shipping_region_id');
    }
    rows = await this.dbExec.connect('CALL customer_update_address(?,?,?,?,?,?,?,?)', [user_id, address_1, address_2, city, region, postal_code, country, shipping_region_id]);
    if (rows.affectedRows === 0) {
      return new ApplicationError('Failed to update record.', 'USR_02', 400, 'saving');
    }
    return true;
  }

  async updateCustomerCard(data: CustomerCreditCard, user_id: number) {
    const { credit_card }  = data;
    const rows: any = await this.dbExec.connect('CALL customer_update_credit_card(?,?)', [user_id, credit_card.replace(/.(?=.{4,}$)/g, '*')]);
    if (rows.affectedRows === 0) {
      return new ApplicationError('Failed to update record.', 'USR_02', 400, 'saving');
    }
    return true;
  }

}
