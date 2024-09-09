import {
  executeChild,
  ParentClosePolicy,
  proxyActivities,
} from '@temporalio/workflow';
import { ISaveOrderActivity } from './activity/saveOrder.activity';
import { ISendOrderCreatedEventActivity } from './activity/sendOrderCreatedDomainEvent.activity';
import { ISendSyncEventActivity } from './activity/sendSyncEvent.activity';
import { Order } from '../domain/order';
import { ISayHiActivity } from './activity/sayHi.activity';

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

const { sayHello } = proxyActivities<ISayHiActivity>({
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
    args: [order],
    parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
  })

}

export async function sayHi(order: Order): Promise<void> {
  console.log('before sayHello');
  await sayHello(order);
  console.log('after sayHello');
}

export async function sayBye(): Promise<void> {
  console.log('Bye');
}