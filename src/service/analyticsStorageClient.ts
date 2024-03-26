import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsStorageClient {
  async sync(event: any): Promise<void> {
    console.log('Saving event to analytics storage', event);
  }
}
