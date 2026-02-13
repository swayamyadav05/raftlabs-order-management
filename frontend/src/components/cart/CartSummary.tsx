"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  totalAmount: number;
  totalItems: number;
}

export function CartSummary({ totalAmount, totalItems }: CartSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="font-semibold text-lg">Order Summary</h2>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Items ({totalItems})
          </span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <Button asChild className="w-full">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
