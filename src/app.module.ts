import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE, MiddlewareBuilder } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { TypeOrmConfigService } from '../config/typeorm.config';
const cookieSession = require('cookie-session');

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, //so that we don't have to re-import the config module all over the place
    envFilePath: `.env.${process.env.NODE_ENV}` //will tell it which enviroment we're in, development or test .NODE_ENV will change depending on where we are
  }),

  //cancelled at the end of the course for deployment and added TypeOrmModule.forRoot() instead then we made orm.config.js
  // TypeOrmModule.forRootAsync({
  //   inject: [ConfigService], //that's what tells the dependency injection system that we want to find the configuration service which should have all of our config info inside of it
  //   useFactory: (config: ConfigService) => {//this is the dependency injection part
  //     return {
  //       type: 'sqlite',
  //       database: config.get<string>('DB_NAME'), //here we specify what inviroment variable we want to read from .env.test and .env.development
  //       synchronize: true,
  //       entities: [User, Report],
  //     };
  //   },
  // }),

  //cancelled early
  //   TypeOrmModule.forRoot({
  //   type: 'sqlite',
  //   database: 'db.sqlite',
  //   entities: [User, Report],
  //   synchronize: true,
  // }),

    TypeOrmModule.forRootAsync({useClass: TypeOrmConfigService,}),
    UsersModule,
    ReportsModule,],
  controllers: [AppController],
  providers: [
    AppService,
    { //Setting up a global pipe from inside app module
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    }
    ],
})
export class AppModule {
  constructor(
    private configService: ConfigService
  ) {}
  configure(consumer: MiddlewareConsumer) {
    //here we can setup some middleware that will run on every single incoming request. we're taking cookie session from main.ts
    consumer.apply(cookieSession({
      keys: [this.configService.get('COOKIE_KEY')],
      }),
      )
      .forRoutes('*'); //This means we want to make use of this middleware on every single incoming request i.e. global middleware
  };
};
