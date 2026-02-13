import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOrderStatus } from "@/hooks/useOrderStatus";

// Mock WebSocket
let mockWsInstance: {
  onopen?: () => void;
  onmessage?: (event: { data: string }) => void;
  onclose?: () => void;
  onerror?: () => void;
  close: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  mockWsInstance = { close: vi.fn() };
  // Must use a real function (not arrow) so `new WebSocket(...)` works
  vi.stubGlobal(
    "WebSocket",
    vi.fn(function () {
      return mockWsInstance;
    })
  );
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useOrderStatus", () => {
  it("returns null initially", () => {
    const { result } = renderHook(() => useOrderStatus("order-1"));
    expect(result.current).toBeNull();
  });

  it("connects to WebSocket on mount", () => {
    renderHook(() => useOrderStatus("order-1"));
    expect(WebSocket).toHaveBeenCalledTimes(1);
  });

  it("updates status when receiving matching ORDER_STATUS_UPDATE", () => {
    const { result } = renderHook(() => useOrderStatus("order-1"));

    // Simulate backend message with the ACTUAL shape the backend sends:
    // { type: "ORDER_STATUS_UPDATE", orderId: "order-1", status: "preparing", updatedAt: "..." }
    act(() => {
      mockWsInstance.onmessage?.({
        data: JSON.stringify({
          type: "ORDER_STATUS_UPDATE",
          orderId: "order-1",
          status: "preparing",
          updatedAt: new Date().toISOString(),
        }),
      });
    });

    expect(result.current).toBe("preparing");
  });

  it("ignores messages for different order IDs", () => {
    const { result } = renderHook(() => useOrderStatus("order-1"));

    act(() => {
      mockWsInstance.onmessage?.({
        data: JSON.stringify({
          type: "ORDER_STATUS_UPDATE",
          orderId: "order-999",
          status: "delivered",
          updatedAt: new Date().toISOString(),
        }),
      });
    });

    expect(result.current).toBeNull();
  });

  it("ignores non-ORDER_STATUS_UPDATE messages", () => {
    const { result } = renderHook(() => useOrderStatus("order-1"));

    act(() => {
      mockWsInstance.onmessage?.({
        data: JSON.stringify({ type: "connected", message: "WebSocket connected" }),
      });
    });

    expect(result.current).toBeNull();
  });

  it("tracks multiple status transitions", () => {
    const { result } = renderHook(() => useOrderStatus("order-1"));

    const statuses = ["preparing", "out_for_delivery", "delivered"] as const;
    for (const status of statuses) {
      act(() => {
        mockWsInstance.onmessage?.({
          data: JSON.stringify({
            type: "ORDER_STATUS_UPDATE",
            orderId: "order-1",
            status,
            updatedAt: new Date().toISOString(),
          }),
        });
      });
      expect(result.current).toBe(status);
    }
  });

  it("handles malformed JSON without crashing", () => {
    const { result } = renderHook(() => useOrderStatus("order-1"));

    act(() => {
      mockWsInstance.onmessage?.({ data: "not valid json{{{" });
    });

    expect(result.current).toBeNull();
  });

  it("closes WebSocket on unmount", () => {
    const { unmount } = renderHook(() => useOrderStatus("order-1"));
    unmount();
    expect(mockWsInstance.close).toHaveBeenCalled();
  });

  it("reconnects after WebSocket closes", () => {
    renderHook(() => useOrderStatus("order-1"));
    expect(WebSocket).toHaveBeenCalledTimes(1);

    // Simulate close
    act(() => {
      mockWsInstance.onclose?.();
    });

    // Advance past reconnect delay
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(WebSocket).toHaveBeenCalledTimes(2);
  });

  it("does not connect when orderId is empty", () => {
    renderHook(() => useOrderStatus(""));
    expect(WebSocket).not.toHaveBeenCalled();
  });
});
