import { z } from 'zod';

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1, 'Menu item ID is required'),
  quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    phone: z.string().regex(
      /^(\+\d{1,3})?\d{10}$/,
      'Phone must be 10 digits, optionally with country code'
    ),
  }),
});

export const updateStatusSchema = z.object({
  status: z.enum(['received', 'preparing', 'out_for_delivery', 'delivered']),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;
export type UpdateStatusBody = z.infer<typeof updateStatusSchema>;
