import { Module, HttpModule, NestMiddleware, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from './config/config.module';
import { MainModule } from './main/main.module';

@Module({
  imports: [
    UtilsModule, 
    ConfigModule,
    MainModule,
    HttpModule,
    MorganModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
  ],
})
export class AppModule {}
