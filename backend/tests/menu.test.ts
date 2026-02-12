import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Menu API', () => {
  describe('GET /api/menu', () => {
    it('should return all menu items', async () => {
      const res = await request(app).get('/api/menu');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return items with correct shape', async () => {
      const res = await request(app).get('/api/menu');
      const item = res.body[0];

      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('image');
      expect(item).toHaveProperty('category');
    });

    it('should include items from all categories', async () => {
      const res = await request(app).get('/api/menu');
      const categories = new Set(res.body.map((item: any) => item.category));

      expect(categories.has('pizza')).toBe(true);
      expect(categories.has('burger')).toBe(true);
      expect(categories.has('drink')).toBe(true);
      expect(categories.has('dessert')).toBe(true);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item by id', async () => {
      const res = await request(app).get('/api/menu/pizza-1');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('pizza-1');
      expect(res.body.name).toBe('Margherita Pizza');
    });

    it('should return 404 for non-existent item', async () => {
      const res = await request(app).get('/api/menu/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Menu item not found');
    });
  });
});
