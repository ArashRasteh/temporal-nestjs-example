import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageBrokerClient {
  async publishMessage(message: string): Promise<void> {
    console.log(`Publishing message: ${message}`);
  }
}
