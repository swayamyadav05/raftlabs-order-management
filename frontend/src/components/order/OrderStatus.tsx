"use client";

import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types";

const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  received: { label: "Received", variant: "secondary" },
  preparing: { label: "Preparing", variant: "default" },
  out_for_delivery: { label: "Out for Delivery", variant: "default" },
  delivered: { label: "Delivered", variant: "outline" },
};

export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
