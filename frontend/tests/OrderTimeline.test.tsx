import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderTimeline } from "@/components/order/OrderTimeline";

describe("OrderTimeline", () => {
  it("renders all four status steps", () => {
    render(<OrderTimeline status="received" />);
    expect(screen.getByText("Order Received")).toBeInTheDocument();
    expect(screen.getByText("Preparing")).toBeInTheDocument();
    expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("shows 'In progress...' for current non-delivered step", () => {
    render(<OrderTimeline status="preparing" />);
    expect(screen.getByText("In progress...")).toBeInTheDocument();
  });

  it("shows arrival message when delivered", () => {
    render(<OrderTimeline status="delivered" />);
    expect(screen.getByText("Your order has arrived!")).toBeInTheDocument();
  });

  it("marks earlier steps as completed", () => {
    const { container } = render(<OrderTimeline status="out_for_delivery" />);
    // First two steps (received, preparing) should have primary bg (completed state)
    const circles = container.querySelectorAll(".rounded-full");
    // received = completed, preparing = completed, out_for_delivery = current, delivered = pending
    expect(circles[0].className).toContain("bg-primary");
    expect(circles[1].className).toContain("bg-primary");
    expect(circles[2].className).toContain("bg-primary/10"); // current
  });
});
