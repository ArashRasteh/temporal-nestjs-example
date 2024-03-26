import { Injectable } from '@nestjs/common';
import { Activities, Activity } from 'nestjs-temporal';
import { Order } from '../../domain/order';
import { MessageBrokerClient } from '../../service/messageBrokerClient';

@Injectable()
@Activities()
export class SendOrderCreatedEventActivity {
  constructor(private readonly messageBrokerClient: MessageBrokerClient) {}

  @Activity()
  async sendOrderCreatedEvent(order: Order): Promise<void> {
    await this.messageBrokerClient.publishMessage(JSON.stringify(order));
  }
}

export interface ISendOrderCreatedEventActivity {
  sendOrderCreatedEvent(order: Order): Promise<void>;
}
