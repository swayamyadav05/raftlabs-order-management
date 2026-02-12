export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pizza' | 'burger' | 'drink' | 'dessert';
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface Customer {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: Customer;
  status: 'received' | 'preparing' | 'out_for_delivery' | 'delivered';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = Order['status'];

export interface CreateOrderInput {
  items: OrderItem[];
  customer: Customer;
}
