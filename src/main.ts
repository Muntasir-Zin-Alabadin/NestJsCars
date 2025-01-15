import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session'); //this library is not compatible with our typescripot settings, so we had to use this method

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['abcde'],
    }),
  );

  //await app.listen(process.env.PORT ?? 3000); //local
  await app.listen(process.env.PORT || 3000); //Heroku
}
bootstrap();
