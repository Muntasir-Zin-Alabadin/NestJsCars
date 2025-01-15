// simpler way for fixing integration testing 113.App Setup Issue in Spec Files (not the nest way but still works)
// import { ValidationPipe } from '@nestjs/common';
// const cookieSession = require('cookie-session');
// cut from main.ts
//add import {setupApp} from './setup-app'; and then we call setupApp under const app i.e 
//const app = await NestFactory.create(AppModule);
//setupApp(app);
//add import setupApp to the test file auth.e2e-spec.ts and then we call it under app = moduleFixture.createNestApplication();

// export const setupApp = (app: any) {
//     app.use(cookieSession({
//     keys: ['abcde'],
//     }),
//   );
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true
//     })
//   );
// cut from main.ts
// }
 
