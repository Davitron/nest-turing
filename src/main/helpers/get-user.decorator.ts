import { createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';

export const GetUser = createParamDecorator((config: ConfigService, req) => {
  if (!!req.user_id) {
      return req.user_id;
  }

  const token = req.headers['user-key'].split(' ');
  if (token && token[1]) {
    const { customer_id }: any = jwt.verify(token[1], config.get('JWT_SECRET'));
    return customer_id;
  }
})