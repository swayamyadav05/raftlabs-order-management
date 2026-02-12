import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { store } from '../src/store/index.js';

const validOrder = {
  items: [
    { menuItemId: 'pizza-1', quantity: 2 },
    { menuItemId: 'drink-1', quantity: 1 },
  ],
  customer: {
    name: 'John Doe',
    address: '123 Main Street, Apt 4',
    phone: '1234567890',
  },
};

describe('Order API', () => {
  beforeEach(() => {
    store.orders.clear();
  });

  describe('POST /api/orders', () => {
    it('should create an order with valid data', async () => {
      const res = await request(app).post('/api/orders').send(validOrder);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('received');
      expect(res.body.items).toHaveLength(2);
      expect(res.body.customer.name).toBe('John Doe');
    });

    it('should calculate total amount correctly', async () => {
      const res = await request(app).post('/api/orders').send(validOrder);

      // pizza-1 = 12.99 * 2 = 25.98, drink-1 = 2.49 * 1 = 2.49
      expect(res.body.totalAmount).toBe(28.47);
    });

    it('should include timestamps', async () => {
      const res = await request(app).post('/api/orders').send(validOrder);

      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
    });

    it('should reject order with no items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ ...validOrder, items: [] });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should reject order with missing customer name', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: validOrder.items,
          customer: { name: '', address: '123 Main St, Apt 4', phone: '1234567890' },
        });

      expect(res.status).toBe(400);
    });

    it('should reject order with short customer name', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: validOrder.items,
          customer: { name: 'A', address: '123 Main St, Apt 4', phone: '1234567890' },
        });

      expect(res.status).toBe(400);
    });

    it('should reject order with short address', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: validOrder.items,
          customer: { name: 'John', address: '123', phone: '1234567890' },
        });

      expect(res.status).toBe(400);
    });

    it('should reject order with invalid phone number', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          items: validOrder.items,
          customer: { name: 'John', address: '123 Main Street', phone: '123' },
        });

      expect(res.status).toBe(400);
    });

    it('should accept phone with country code', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          ...validOrder,
          customer: { ...validOrder.customer, phone: '+11234567890' },
        });

      expect(res.status).toBe(201);
    });

    it('should reject order with invalid menu item id', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          ...validOrder,
          items: [{ menuItemId: 'nonexistent', quantity: 1 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Menu item not found');
    });

    it('should reject order with zero quantity', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          ...validOrder,
          items: [{ menuItemId: 'pizza-1', quantity: 0 }],
        });

      expect(res.status).toBe(400);
    });

    it('should reject order with negative quantity', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          ...validOrder,
          items: [{ menuItemId: 'pizza-1', quantity: -1 }],
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return an order by id', async () => {
      const createRes = await request(app).post('/api/orders').send(validOrder);
      const orderId = createRes.body.id;

      const res = await request(app).get(`/api/orders/${orderId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(orderId);
    });

    it('should return 404 for non-existent order', async () => {
      const res = await request(app).get('/api/orders/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Order not found');
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update order status', async () => {
      const createRes = await request(app).post('/api/orders').send(validOrder);
      const orderId = createRes.body.id;

      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'preparing' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('preparing');
    });

    it('should update updatedAt on status change', async () => {
      const createRes = await request(app).post('/api/orders').send(validOrder);
      const orderId = createRes.body.id;
      const originalUpdatedAt = createRes.body.updatedAt;

      // Small delay to ensure timestamp difference
      await new Promise((r) => setTimeout(r, 10));

      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'preparing' });

      expect(res.body.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('should return 404 for non-existent order', async () => {
      const res = await request(app)
        .patch('/api/orders/nonexistent/status')
        .send({ status: 'preparing' });

      expect(res.status).toBe(404);
    });

    it('should reject invalid status', async () => {
      const createRes = await request(app).post('/api/orders').send(validOrder);
      const orderId = createRes.body.id;

      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'invalid_status' });

      expect(res.status).toBe(400);
    });
  });
});
