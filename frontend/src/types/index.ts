export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "pizza" | "burger" | "drink" | "dessert";
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: { menuItemId: string; quantity: number }[];
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  status: "received" | "preparing" | "out_for_delivery" | "delivered";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: { menuItemId: string; quantity: number }[];
  customer: {
    name: string;
    address: string;
    phone: string;
  };
}
