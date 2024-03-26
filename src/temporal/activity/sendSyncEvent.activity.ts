import { Injectable } from '@nestjs/common';
import { Activities, Activity } from 'nestjs-temporal';
import { Order } from '../order';
import { AnalyticsStorageClient } from '../service/analyticsStorageClient';

@Injectable()
@Activities()
export class SendSyncEventActivity {
  constructor(
    private readonly analyticsStorageClient: AnalyticsStorageClient,
  ) {}

  @Activity()
  async sendAnalyticsSyncEvent(order: Order): Promise<void> {
    await this.analyticsStorageClient.sync(order);
  }
}

export interface ISendSyncEventActivity {
  sendAnalyticsSyncEvent(order: Order): Promise<void>;
}
