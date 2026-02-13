"use client";

import { Check, Clock, ChefHat, Truck, Package } from "lucide-react";
import type { Order } from "@/types";

const STEPS: {
  status: Order["status"];
  label: string;
  icon: React.ElementType;
}[] = [
  { status: "received", label: "Order Received", icon: Clock },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: Package },
];

function getStepIndex(status: Order["status"]): number {
  return STEPS.findIndex((s) => s.status === status);
}

export function OrderTimeline({ status }: { status: Order["status"] }) {
  const currentIndex = getStepIndex(status);

  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = isCompleted ? Check : step.icon;

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center size-10 rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/30 text-muted-foreground/30"
                }`}
              >
                <Icon className="size-5" />
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-10 transition-colors ${
                    isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>
            <div className="pt-2">
              <p
                className={`font-medium text-sm ${
                  isCompleted || isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {status === "delivered" ? "Your order has arrived!" : "In progress..."}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
