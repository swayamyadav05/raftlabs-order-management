import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/lib/api";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("api.getMenu", () => {
  it("fetches menu items", async () => {
    const menuItems = [{ id: "1", name: "Pizza" }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(menuItems),
    });

    const result = await api.getMenu();
    expect(result).toEqual(menuItems);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/menu")
    );
  });

  it("throws on failed fetch", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(api.getMenu()).rejects.toThrow("Failed to fetch menu");
  });
});

describe("api.createOrder", () => {
  it("creates an order", async () => {
    const order = { id: "order-1", status: "received" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(order),
    });

    const result = await api.createOrder({
      items: [{ menuItemId: "pizza-1", quantity: 2 }],
      customer: { name: "John", address: "123 St", phone: "1234567890" },
    });

    expect(result).toEqual(order);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/orders"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("throws with server error message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Invalid phone number" }),
    });

    await expect(
      api.createOrder({
        items: [{ menuItemId: "pizza-1", quantity: 1 }],
        customer: { name: "John", address: "123 St", phone: "bad" },
      })
    ).rejects.toThrow("Invalid phone number");
  });
});

describe("api.getOrder", () => {
  it("fetches an order by id", async () => {
    const order = { id: "order-1", status: "preparing" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(order),
    });

    const result = await api.getOrder("order-1");
    expect(result).toEqual(order);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/orders/order-1")
    );
  });

  it("throws on not found", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    await expect(api.getOrder("bad-id")).rejects.toThrow("Order not found");
  });
});
