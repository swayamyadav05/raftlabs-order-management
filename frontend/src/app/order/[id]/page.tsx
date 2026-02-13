"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useOrderStatus } from "@/hooks/useOrderStatus";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { OrderStatusBadge } from "@/components/order/OrderStatus";
import type { Order, MenuItem } from "@/types";

interface OrderItemWithDetails {
  menuItemId: string;
  quantity: number;
  name: string;
  price: number;
}

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [itemDetails, setItemDetails] = useState<OrderItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsStatus = useOrderStatus(params.id);

  useEffect(() => {
    Promise.all([api.getOrder(params.id), api.getMenu()])
      .then(([orderData, menu]: [Order, MenuItem[]]) => {
        setOrder(orderData);
        setItemDetails(
          orderData.items.map((item) => {
            const menuItem = menu.find((m) => m.id === item.menuItemId);
            return {
              ...item,
              name: menuItem?.name || "Unknown Item",
              price: menuItem?.price || 0,
            };
          })
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const currentStatus = wsStatus || order?.status;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error || "Order not found"}</p>
        <Button asChild variant="outline">
          <Link href="/">Back to Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href="/">
          <ArrowLeft className="size-4" /> Back to Menu
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        {currentStatus && <OrderStatusBadge status={currentStatus} />}
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Order Progress</h2>
            {currentStatus && <OrderTimeline status={currentStatus} />}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold">Order Details</h2>
            {itemDetails.map((item) => (
              <div
                key={item.menuItemId}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-1">
            <h2 className="font-semibold mb-2">Delivery To</h2>
            <p className="text-sm">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.customer.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.customer.phone}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
