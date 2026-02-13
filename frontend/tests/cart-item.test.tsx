import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartItem } from "@/components/cart/CartItem";
import type { CartItem as CartItemType } from "@/types";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={props.src as string}
      alt={props.alt as string}
      data-testid="cart-item-image"
    />
  ),
}));

const item: CartItemType = {
  menuItem: {
    id: "pizza-1",
    name: "Margherita Pizza",
    description: "Classic",
    price: 12.99,
    image: "https://images.unsplash.com/photo.jpg",
    category: "pizza",
  },
  quantity: 2,
};

describe("CartItem", () => {
  it("renders item name", () => {
    render(
      <CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
  });

  it("renders unit price", () => {
    render(
      <CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByText("$12.99")).toBeInTheDocument();
  });

  it("renders quantity", () => {
    render(
      <CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders subtotal", () => {
    render(
      <CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />
    );
    expect(screen.getByText("$25.98")).toBeInTheDocument();
  });

  it("calls onUpdateQuantity with decremented value on minus click", () => {
    const onUpdate = vi.fn();
    render(
      <CartItem item={item} onUpdateQuantity={onUpdate} onRemove={vi.fn()} />
    );
    // Find the minus button (first icon-xs button)
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]); // minus
    expect(onUpdate).toHaveBeenCalledWith("pizza-1", 1);
  });

  it("calls onUpdateQuantity with incremented value on plus click", () => {
    const onUpdate = vi.fn();
    render(
      <CartItem item={item} onUpdateQuantity={onUpdate} onRemove={vi.fn()} />
    );
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // plus
    expect(onUpdate).toHaveBeenCalledWith("pizza-1", 3);
  });

  it("calls onRemove on delete click", () => {
    const onRemove = vi.fn();
    render(
      <CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={onRemove} />
    );
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]); // trash
    expect(onRemove).toHaveBeenCalledWith("pizza-1");
  });

  it("has responsive layout classes for mobile stacking", () => {
    const { container } = render(
      <CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />
    );
    // The root wrapper should use flex-col on mobile and sm:flex-row on desktop
    const root = container.firstElementChild;
    expect(root?.className).toContain("flex-col");
    expect(root?.className).toContain("sm:flex-row");
  });
});
