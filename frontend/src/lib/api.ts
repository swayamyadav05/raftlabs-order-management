import type { MenuItem, Order, CreateOrderRequest } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://raftlabs-order-management.onrender.com";

export const api = {
  getMenu: async (): Promise<MenuItem[]> => {
    const res = await fetch(`${API_BASE}/api/menu`);
    if (!res.ok) throw new Error("Failed to fetch menu");
    return res.json();
  },

  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create order");
    }
    return res.json();
  },

  getOrder: async (id: string): Promise<Order> => {
    const res = await fetch(`${API_BASE}/api/orders/${id}`);
    if (!res.ok) throw new Error("Order not found");
    return res.json();
  },
};
