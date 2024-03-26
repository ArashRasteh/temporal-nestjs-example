import { Controller, Post } from '@nestjs/common';
import { InjectTemporalClient } from 'nestjs-temporal';
import { WorkflowClient } from '@temporalio/client';
import { WorkflowService } from '../service/workflowService';

@Controller()
export class AppController {
  constructor(private readonly workflowService: WorkflowService) {}
  @Post()
  async makeOrder() {
    const order = {
      id: 'order-id-' + Math.floor(Math.random() * 1000),
      name: 'order-name-' + Math.floor(Math.random() * 1000),
      price: 100,
      quantity: 2,
      status: 'pending',
    };

    await this.workflowService.makeOrder(order);

    return {
      result: order,
    };
  }
}
