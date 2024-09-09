import { Injectable } from '@nestjs/common';
import { Activities, Activity } from 'nestjs-temporal';
import { Order } from '../../domain/order';
import { AnalyticsStorageClient } from '../../service/analyticsStorageClient';

@Injectable()
@Activities()
export class SayHiActivity {
  constructor(
    private readonly analyticsStorageClient: AnalyticsStorageClient,
  ) {}


  @Activity()
  async sayHello(order: Order): Promise<void> {
    await this.analyticsStorageClient.sync(order);
    // console.log('hello from inside SayHiActivity');
  }
}

export interface ISayHiActivity {
  sayHello(order: Order): Promise<void>;
}
