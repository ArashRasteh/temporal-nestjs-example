import { Injectable } from '@nestjs/common';
import { InjectTemporalClient } from 'nestjs-temporal';
import { WorkflowClient } from '@temporalio/client';
import { Order } from '../domain/order';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectTemporalClient() private readonly temporalClient: WorkflowClient,
  ) {}

  async makeOrder(order: Order): Promise<string> {
    const handle = await this.temporalClient.start('processOrder', {
      args: [order],
      taskQueue: 'default',
      workflowId: 'wf-id-' + Math.floor(Math.random() * 1000),
    });
    console.log(`Started workflow ${handle.workflowId}`);
    const result = await handle.result();
    console.log(`Workflow result: ${result}`);
    return result;
  }
}
