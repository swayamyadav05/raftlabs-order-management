import { nanoid } from 'nanoid';
import { store } from '../store/index.js';
import { Order, CreateOrderInput, OrderStatus } from '../types/index.js';
import { simulateStatusProgression } from '../utils/statusSimulator.js';

export const orderService = {
  create(input: CreateOrderInput): Order {
    // Calculate total from menu prices
    let totalAmount = 0;
    for (const item of input.items) {
      const menuItem = store.menu.getById(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.menuItemId}`);
      }
      totalAmount += menuItem.price * item.quantity;
    }

    // Round to 2 decimal places to avoid floating point issues
    totalAmount = Math.round(totalAmount * 100) / 100;

    const now = new Date();
    const order: Order = {
      id: nanoid(),
      items: input.items,
      customer: input.customer,
      status: 'received',
      totalAmount,
      createdAt: now,
      updatedAt: now,
    };

    const created = store.orders.create(order);
    simulateStatusProgression(created.id);
    return created;
  },

  getById(id: string): Order | undefined {
    return store.orders.getById(id);
  },

  updateStatus(id: string, status: OrderStatus): Order | undefined {
    const order = store.orders.getById(id);
    if (!order) return undefined;
    return store.orders.update(id, { status });
  },
};
