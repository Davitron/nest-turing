import { Injectable, ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import ApplicationError from './application-error';

@Injectable()
@Catch()
export class GlobalErrorService implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const control = host.switchToHttp();
    const response = control.getResponse();
    const request = control.getRequest();

    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);

    const error =  {
      name: exception.name || undefined,
      code: exception.code || null,
      message: exception.message || 'Internal Server Error',
      field: exception.field || null
    }
    
    response
      .status(status)
      .json(error)
  }

}
