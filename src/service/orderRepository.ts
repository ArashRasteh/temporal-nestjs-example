import { Injectable } from '@nestjs/common';
import { Order } from '../domain/order';

@Injectable()
export class OrderRepository {
  storage: Record<string, Order> = {};

  async save(order: Order): Promise<void> {
    this.storage[order.id] = order;
  }
}
