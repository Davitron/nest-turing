import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { urlencoded, json } from 'body-parser';
import { AppModule } from './app.module';
import { GlobalErrorService } from './utils/global-error/global-error.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });

  const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
  };

  app.use(urlencoded({verify: rawBodyBuffer, extended: true }));
  app.use(json({ verify: rawBodyBuffer }));

  app.useGlobalFilters(new GlobalErrorService())
  await app.listen(3002);
}
bootstrap();
