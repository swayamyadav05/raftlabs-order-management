import { OrderStatus } from '../types/index.js';
import { store } from '../store/index.js';
import { broadcast } from '../websocket/index.js';

const STATUS_FLOW: OrderStatus[] = ['received', 'preparing', 'out_for_delivery', 'delivered'];
const TRANSITION_DELAY_MS = 10_000; // 10 seconds between status changes

export function simulateStatusProgression(orderId: string): void {
  let currentIndex = 0;

  const interval = setInterval(() => {
    currentIndex++;
    if (currentIndex >= STATUS_FLOW.length) {
      clearInterval(interval);
      return;
    }

    const nextStatus = STATUS_FLOW[currentIndex];
    const updated = store.orders.update(orderId, { status: nextStatus });

    if (updated) {
      broadcast({
        type: 'ORDER_STATUS_UPDATE',
        orderId: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt,
      });
    }
  }, TRANSITION_DELAY_MS);
}
