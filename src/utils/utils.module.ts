import { Module } from '@nestjs/common';
import { GlobalErrorService } from './global-error/global-error.service';
import { ConfigModule } from '../config/config.module';
import { ConnectionService } from './connection/connection.service';


@Module({
  providers: [ConnectionService, GlobalErrorService],
  imports: [ConfigModule],
  exports: [ConnectionService],
})
export class UtilsModule {}
