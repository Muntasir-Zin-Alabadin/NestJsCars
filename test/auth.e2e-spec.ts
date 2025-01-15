import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handels a signup request', () => {
    const email = 'testaaa@gmail.com';
    return request(app.getHttpServer())
    .post('/auth/signup')
    .send({ email, password: 'abcd'})
    .expect(201) //the status code we get when we create a new user
    .then((res) => { //res stands for response
    const {id, email} = res.body;
    expect(id).toBeDefined() //I expect the id to exist
    expect(email).toEqual(email)
    });
  });
  
  it('signup as a new user then get the currently logged in user', async () => { //sign in then get whoami route
    const email = 'abcd@efg.com';

    request(app.getHttpServer())
        
        const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({email, password: 'abc'})
        .expect(201)

    const cookie = res.get('Set-Cookie');

    const {body} = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie) //calling set with the string cookie sets the cookie header on the ongoing request, we then provide the cookie we want to set inside it
            .expect(200)
    
    expect(body.email).toEqual(email);
  });
});
