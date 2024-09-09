import {
  executeChild,
  ParentClosePolicy,
  proxyActivities,
} from '@temporalio/workflow';
import { ISaveOrderActivity } from './activity/saveOrder.activity';
import { ISendOrderCreatedEventActivity } from './activity/sendOrderCreatedDomainEvent.activity';
import { ISendSyncEventActivity } from './activity/sendSyncEvent.activity';
import { Order } from '../domain/order';

const { saveOrder } = proxyActivities<ISaveOrderActivity>({
  startToCloseTimeout: '1 minute',
});

const { sendOrderCreatedEvent } =
  proxyActivities<ISendOrderCreatedEventActivity>({
    startToCloseTimeout: '1 minute',
  });

const { sendAnalyticsSyncEvent } = proxyActivities<ISendSyncEventActivity>({
  startToCloseTimeout: '1 minute',
});

export async function processOrder(order: Order): Promise<string> {
  await saveOrder(order);

  await executeChild(syncOrder, {
    args: [order],
    parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
  });

  return order.id;
}

export async function syncOrder(order: Order): Promise<void> {
  await sendOrderCreatedEvent(order);
  await sendAnalyticsSyncEvent(order);

  await executeChild(sayHi, {
    parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
  })

}

export async function sayHi(): Promise<void> {
  console.log('Hi');
}