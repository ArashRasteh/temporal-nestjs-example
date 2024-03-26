import { Injectable } from '@nestjs/common';
import { Activities, Activity } from 'nestjs-temporal';
import { Order } from '../../domain/order';
import { OrderRepository } from '../../service/orderRepository';

@Injectable()
@Activities()
export class SaveOrderActivity {
  constructor(private readonly orderRepository: OrderRepository) {}

  @Activity()
  async saveOrder(order: Order): Promise<void> {
    await this.orderRepository.save(order);
  }
}

export interface ISaveOrderActivity {
  saveOrder(order: Order): Promise<void>;
}
