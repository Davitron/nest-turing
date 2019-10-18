import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import ApplicationError from '../../utils/global-error/application-error';

let config = new ConfigService('.env');

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request) {
      const bearerToken: string = request.headers['user-key'];
      if (!bearerToken) {
        return false;
      }
      request.user_id = await this.validateToken(bearerToken);
      return true
    }
  }

  async validateToken(auth: string) {
    const bearer = (auth)? auth.split(' ')[0]: null
    if (bearer && bearer === 'Bearer') {
      const token = auth.split(' ')[1];
      try {
        const  { customer_id }: any = await jwt.verify(token, config.get('JWT_SECRET'))
        return customer_id;
      } catch (error) {
        throw new ApplicationError(error.message, 'AUT_01', 401, 'API-KEY');
      }
    }
    throw new ApplicationError('Access Unauthorized.', 'AUT_01', 401, 'API-KEY');
  }
}