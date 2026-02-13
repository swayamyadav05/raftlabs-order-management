import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CheckoutPage from "@/app/checkout/page";

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

let mockMounted = true;
let mockItemCount = 0;

vi.mock("@/hooks/CartProvider", () => ({
  useCartContext: () => ({
    items: Array.from({ length: mockItemCount }, () => ({
      menuItem: { id: "x", name: "X", price: 1, image: "", description: "", category: "pizza" },
      quantity: 1,
    })),
    mounted: mockMounted,
    totalAmount: mockItemCount,
    clearCart: vi.fn(),
  }),
}));

// Mock the CheckoutForm to avoid rendering the full form
vi.mock("@/components/checkout/CheckoutForm", () => ({
  CheckoutForm: () => <div data-testid="checkout-form">form</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockMounted = true;
  mockItemCount = 0;
});

describe("CheckoutPage", () => {
  it("renders checkout form when cart has items", () => {
    mockItemCount = 2;
    render(<CheckoutPage />);
    expect(screen.getByTestId("checkout-form")).toBeInTheDocument();
    expect(screen.getByText("Checkout")).toBeInTheDocument();
  });

  it("redirects to /cart when cart is empty and mounted", async () => {
    mockItemCount = 0;
    mockMounted = true;
    render(<CheckoutPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/cart");
    });
  });

  it("returns null before mount to avoid flash", () => {
    mockMounted = false;
    mockItemCount = 0;
    const { container } = render(<CheckoutPage />);
    expect(container.innerHTML).toBe("");
  });

  it("does NOT redirect to /cart if orderPlaced flag is set", async () => {
    // Simulate: cart was non-empty, order was placed, cart is now empty
    // The page should NOT redirect because an order submission is in progress
    mockItemCount = 2;
    const { rerender } = render(<CheckoutPage />);
    expect(screen.getByTestId("checkout-form")).toBeInTheDocument();

    // Now simulate cart clearing after order placed
    // The key behavior: if we were showing the form, then items go to 0,
    // we should NOT immediately redirect (the form's router.push should win)
    mockItemCount = 0;
    rerender(<CheckoutPage />);

    // Give effects time to fire
    await new Promise((r) => setTimeout(r, 50));

    // This test catches the race condition:
    // After an order is placed, clearCart empties the cart,
    // but the page should NOT call router.replace("/cart")
    // because the form already called router.push("/order/[id]")
    //
    // Current buggy behavior: replace IS called, overriding the push.
    // After fix: replace should NOT be called.
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
