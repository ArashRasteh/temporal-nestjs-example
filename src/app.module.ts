import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { TemporalModule } from 'nestjs-temporal';
import { getTemporalEnv } from '../test/useTemporal';
import { SaveOrderActivity } from './temporal/activity/saveOrder.activity';
import { SendOrderCreatedEventActivity } from './temporal/activity/sendOrderCreatedDomainEvent.activity';
import { SendSyncEventActivity } from './temporal/activity/sendSyncEvent.activity';
import { OrderRepository } from './service/orderRepository';
import { AnalyticsStorageClient } from './service/analyticsStorageClient';
import { MessageBrokerClient } from './service/messageBrokerClient';
import { WorkflowService } from './service/workflowService';
import { SayHiActivity } from './temporal/activity/sayHi.activity';

const activities = [
  SaveOrderActivity,
  SendOrderCreatedEventActivity,
  SendSyncEventActivity,
  SayHiActivity
];

const services = [
  OrderRepository,
  AnalyticsStorageClient,
  MessageBrokerClient,
  WorkflowService,
];

@Module({
  imports: [
    TemporalModule.registerWorkerAsync({
      useFactory: async () => {
        if (process.env.NODE_ENV === 'test') {
          const env = await getTemporalEnv();
          return {
            workerOptions: {
              connection: env.nativeConnection,
              taskQueue: 'default',
              workflowsPath: require.resolve('./temporal/workflows'),
            },
          };
        }

        return {
          workerOptions: {
            taskQueue: 'default',
            workflowsPath: require.resolve('./temporal/workflows'),
          },
        };
      },
    }),
    TemporalModule.registerClientAsync({
      useFactory: async () => {
        if (process.env.NODE_ENV === 'test') {
          const env = await getTemporalEnv();
          return {
            connection: env.connection,
          };
        }

        return {};
      },
    }),
  ],
  controllers: [AppController],
  providers: [...activities, ...services],
})
export class AppModule {}
