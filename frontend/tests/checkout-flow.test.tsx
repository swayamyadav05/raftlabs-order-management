import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import type { MenuItem, Order } from "@/types";

const pizza: MenuItem = {
  id: "pizza-1",
  name: "Margherita Pizza",
  description: "Classic",
  price: 12.99,
  image: "https://images.unsplash.com/photo.jpg",
  category: "pizza",
};

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    createOrder: vi.fn(),
  },
}));

// Track cart state changes
let mockCartItems = [{ menuItem: pizza, quantity: 2 }];
const mockClearCart = vi.fn(() => {
  mockCartItems = [];
});

vi.mock("@/hooks/CartProvider", () => ({
  useCartContext: () => ({
    items: mockCartItems,
    totalAmount: mockCartItems.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0,
    ),
    clearCart: mockClearCart,
    mounted: true,
  }),
}));

import { api } from "@/lib/api";

beforeEach(() => {
  vi.clearAllMocks();
  mockCartItems = [{ menuItem: pizza, quantity: 2 }];
});

describe("Checkout flow", () => {
  it("calls router.push with order id BEFORE clearing cart", async () => {
    const callOrder: string[] = [];

    mockPush.mockImplementation(() => {
      callOrder.push("router.push");
    });
    mockClearCart.mockImplementation(() => {
      callOrder.push("clearCart");
      mockCartItems = [];
    });

    vi.mocked(api.createOrder).mockResolvedValueOnce({
      id: "order-abc123",
      items: [{ menuItemId: "pizza-1", quantity: 2 }],
      customer: {
        name: "John",
        address: "123 Main St",
        phone: "1234567890",
      },
      status: "received",
      totalAmount: 25.98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    render(<CheckoutForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Delivery address"),
      {
        target: { value: "123 Main Street" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText("10-digit phone number"),
      {
        target: { value: "1234567890" },
      },
    );

    fireEvent.click(
      screen.getByRole("button", { name: /place order/i }),
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/order/order-abc123");
    });

    // router.push must be called BEFORE clearCart to avoid the race condition
    expect(callOrder[0]).toBe("router.push");
    expect(callOrder[1]).toBe("clearCart");
  });

  it("shows validation errors and does NOT call API with invalid form", async () => {
    render(<CheckoutForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /place order/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Name must be at least 2 characters"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Address must be at least 5 characters"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Enter a valid 10-digit phone number"),
      ).toBeInTheDocument();
    });

    expect(api.createOrder).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows API error message on failure", async () => {
    vi.mocked(api.createOrder).mockRejectedValueOnce(
      new Error("Menu item not found"),
    );

    render(<CheckoutForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Delivery address"),
      {
        target: { value: "123 Main Street" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText("10-digit phone number"),
      {
        target: { value: "1234567890" },
      },
    );

    fireEvent.click(
      screen.getByRole("button", { name: /place order/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Menu item not found"),
      ).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockClearCart).not.toHaveBeenCalled();
  });

  it("disables submit button while submitting", async () => {
    let resolveOrder: (value: Order | PromiseLike<Order>) => void;
    vi.mocked(api.createOrder).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOrder = resolve;
        }),
    );

    render(<CheckoutForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Delivery address"),
      {
        target: { value: "123 Main Street" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText("10-digit phone number"),
      {
        target: { value: "1234567890" },
      },
    );

    fireEvent.click(
      screen.getByRole("button", { name: /place order/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /placing order/i }),
      ).toBeDisabled();
    });

    // Resolve the pending order
    resolveOrder!({
      id: "order-abc",
      items: [],
      customer: {
        name: "John",
        address: "123 Main St",
        phone: "1234567890",
      },
      status: "received",
      totalAmount: 25.98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  it("sends correct order payload to API", async () => {
    vi.mocked(api.createOrder).mockResolvedValueOnce({
      id: "order-xyz",
      items: [{ menuItemId: "pizza-1", quantity: 2 }],
      customer: {
        name: "Jane",
        address: "456 Oak Ave",
        phone: "9876543210",
      },
      status: "received",
      totalAmount: 25.98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    render(<CheckoutForm />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Delivery address"),
      {
        target: { value: "456 Oak Ave" },
      },
    );
    fireEvent.change(
      screen.getByPlaceholderText("10-digit phone number"),
      {
        target: { value: "9876543210" },
      },
    );

    fireEvent.click(
      screen.getByRole("button", { name: /place order/i }),
    );

    await waitFor(() => {
      expect(api.createOrder).toHaveBeenCalledWith({
        items: [{ menuItemId: "pizza-1", quantity: 2 }],
        customer: {
          name: "Jane Smith",
          address: "456 Oak Ave",
          phone: "9876543210",
        },
      });
    });
  });
});
