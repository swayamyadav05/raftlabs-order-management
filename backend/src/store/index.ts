import { MenuItem, Order } from '../types/index.js';

const menuItems: Map<string, MenuItem> = new Map();
const orders: Map<string, Order> = new Map();

// Seed menu data
const seedMenu: MenuItem[] = [
  {
    id: 'pizza-1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    category: 'pizza',
  },
  {
    id: 'pizza-2',
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni and melted mozzarella',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
    category: 'pizza',
  },
  {
    id: 'pizza-3',
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ sauce, grilled chicken, red onions, and cilantro',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    category: 'pizza',
  },
  {
    id: 'burger-1',
    name: 'Classic Cheeseburger',
    description: 'Angus beef patty with cheddar, lettuce, tomato, and pickles',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    category: 'burger',
  },
  {
    id: 'burger-2',
    name: 'Bacon Smash Burger',
    description: 'Double smashed patties with crispy bacon and special sauce',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
    category: 'burger',
  },
  {
    id: 'drink-1',
    name: 'Cola',
    description: 'Ice-cold classic cola',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    category: 'drink',
  },
  {
    id: 'drink-2',
    name: 'Lemonade',
    description: 'Freshly squeezed lemonade with mint',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
    category: 'drink',
  },
  {
    id: 'dessert-1',
    name: 'Chocolate Brownie',
    description: 'Warm fudgy brownie with vanilla ice cream',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e',
    category: 'dessert',
  },
  {
    id: 'dessert-2',
    name: 'Cheesecake Slice',
    description: 'New York style cheesecake with berry compote',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416',
    category: 'dessert',
  },
];

// Initialize seed data
seedMenu.forEach((item) => menuItems.set(item.id, item));

export const store = {
  menu: {
    getAll: (): MenuItem[] => Array.from(menuItems.values()),
    getById: (id: string): MenuItem | undefined => menuItems.get(id),
  },
  orders: {
    getAll: (): Order[] => Array.from(orders.values()),
    getById: (id: string): Order | undefined => orders.get(id),
    create: (order: Order): Order => {
      orders.set(order.id, order);
      return order;
    },
    update: (id: string, data: Partial<Order>): Order | undefined => {
      const order = orders.get(id);
      if (!order) return undefined;
      const updated = { ...order, ...data, updatedAt: new Date() };
      orders.set(id, updated);
      return updated;
    },
    clear: (): void => {
      orders.clear();
    },
  },
};
