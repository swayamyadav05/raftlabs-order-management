import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/hooks/useCart";
import type { MenuItem } from "@/types";

const pizza: MenuItem = {
  id: "pizza-1",
  name: "Margherita Pizza",
  description: "Classic pizza",
  price: 12.99,
  image: "https://images.unsplash.com/photo.jpg",
  category: "pizza",
};

const burger: MenuItem = {
  id: "burger-1",
  name: "Classic Burger",
  description: "Juicy burger",
  price: 9.99,
  image: "https://images.unsplash.com/photo2.jpg",
  category: "burger",
};

beforeEach(() => {
  localStorage.clear();
});

describe("useCart", () => {
  it("starts with empty cart", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it("adds an item to the cart", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].menuItem.id).toBe("pizza-1");
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
  });

  it("increments quantity when adding same item", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));
    act(() => result.current.addItem(pizza));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("adds multiple different items", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));
    act(() => result.current.addItem(burger));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("removes an item", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));
    act(() => result.current.addItem(burger));
    act(() => result.current.removeItem("pizza-1"));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].menuItem.id).toBe("burger-1");
  });

  it("updates quantity", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));
    act(() => result.current.updateQuantity("pizza-1", 5));
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
  });

  it("removes item when quantity set to 0", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));
    act(() => result.current.updateQuantity("pizza-1", 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("calculates total amount correctly", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza)); // 12.99
    act(() => result.current.addItem(burger)); // 9.99
    act(() => result.current.updateQuantity("pizza-1", 2)); // 25.98 + 9.99
    expect(result.current.totalAmount).toBe(35.97);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));
    act(() => result.current.addItem(burger));
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it("persists cart to localStorage", () => {
    const { result } = renderHook(() => useCart());
    act(() => result.current.addItem(pizza));

    // Check localStorage was updated
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].menuItem.id).toBe("pizza-1");
  });

  it("loads cart from localStorage on mount", () => {
    localStorage.setItem(
      "cart",
      JSON.stringify([{ menuItem: pizza, quantity: 3 }])
    );
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });
});
