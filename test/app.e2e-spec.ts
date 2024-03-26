import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestWorkflowEnvironment } from '@temporalio/testing';
import { getTemporalEnv } from './useTemporal';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let testEnv: TestWorkflowEnvironment;

  beforeAll(async () => {
    testEnv = await getTemporalEnv();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(AnalyticsStorageClient)
      // .useValue({
      //   sync: async () => {
      //     console.log('!!!!!!!!');
      //   },
      // })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should run workflow', async () => {
    return request(app.getHttpServer())
      .post('/')
      .send()
      .expect(201)
      .expect(async (res) => {
        expect(res.body.result).toBeDefined();
        expect(res.body.result.id).toBeDefined();
        expect(res.body.result.name).toBeDefined();
      });
  });
});
