import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import OrderTrackingPage from "@/app/order/[id]/page";
import type { MenuItem } from "@/types";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "order-123" }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// Mock WebSocket
vi.stubGlobal(
  "WebSocket",
  vi.fn(function () {
    return { close: vi.fn() };
  })
);

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    getOrder: vi.fn(),
    getMenu: vi.fn(),
  },
}));

import { api } from "@/lib/api";

const mockOrder = {
  id: "order-123",
  items: [
    { menuItemId: "pizza-1", quantity: 2 },
    { menuItemId: "drink-1", quantity: 1 },
  ],
  customer: { name: "John Doe", address: "123 Main St", phone: "1234567890" },
  status: "preparing" as const,
  totalAmount: 30.47,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

const mockMenu: MenuItem[] = [
  {
    id: "pizza-1",
    name: "Margherita Pizza",
    description: "Classic",
    price: 12.99,
    image: "https://images.unsplash.com/photo.jpg",
    category: "pizza",
  },
  {
    id: "drink-1",
    name: "Lemonade",
    description: "Fresh",
    price: 4.49,
    image: "https://images.unsplash.com/photo2.jpg",
    category: "drink",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Order Details - item names and prices", () => {
  it("displays item names from menu data", async () => {
    vi.mocked(api.getOrder).mockResolvedValueOnce(mockOrder);
    vi.mocked(api.getMenu).mockResolvedValueOnce(mockMenu);

    render(<OrderTrackingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Margherita Pizza/)).toBeInTheDocument();
      expect(screen.getByText(/Lemonade/)).toBeInTheDocument();
    });
  });

  it("displays item quantities", async () => {
    vi.mocked(api.getOrder).mockResolvedValueOnce(mockOrder);
    vi.mocked(api.getMenu).mockResolvedValueOnce(mockMenu);

    render(<OrderTrackingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Margherita Pizza/)).toBeInTheDocument();
    });

    // "x 2" for pizza, "x 1" for drink
    const pizzaRow = screen.getByText(/Margherita Pizza/).closest("div");
    expect(pizzaRow?.textContent).toContain("2");

    const drinkRow = screen.getByText(/Lemonade/).closest("div");
    expect(drinkRow?.textContent).toContain("1");
  });

  it("displays item subtotals", async () => {
    vi.mocked(api.getOrder).mockResolvedValueOnce(mockOrder);
    vi.mocked(api.getMenu).mockResolvedValueOnce(mockMenu);

    render(<OrderTrackingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Margherita Pizza/)).toBeInTheDocument();
    });

    // Pizza: 12.99 * 2 = 25.98
    expect(screen.getByText("$25.98")).toBeInTheDocument();
    // Drink: 4.49 * 1 = 4.49
    expect(screen.getByText("$4.49")).toBeInTheDocument();
  });

  it("displays total amount", async () => {
    vi.mocked(api.getOrder).mockResolvedValueOnce(mockOrder);
    vi.mocked(api.getMenu).mockResolvedValueOnce(mockMenu);

    render(<OrderTrackingPage />);

    await waitFor(() => {
      expect(screen.getByText("$30.47")).toBeInTheDocument();
    });
  });

  it("shows fallback for unknown menu items", async () => {
    const orderWithUnknown = {
      ...mockOrder,
      items: [{ menuItemId: "deleted-item", quantity: 1 }],
    };
    vi.mocked(api.getOrder).mockResolvedValueOnce(orderWithUnknown);
    vi.mocked(api.getMenu).mockResolvedValueOnce(mockMenu);

    render(<OrderTrackingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Unknown Item/)).toBeInTheDocument();
    });
  });
});
