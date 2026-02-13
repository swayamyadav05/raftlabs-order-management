"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartContext } from "@/hooks/CartProvider";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalAmount, totalItems } =
    useCartContext();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Add some items from the menu to get started
        </p>
        <Button asChild>
          <Link href="/">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="divide-y">
            {items.map((item) => (
              <CartItem
                key={item.menuItem.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <div>
          <CartSummary totalAmount={totalAmount} totalItems={totalItems} />
        </div>
      </div>
    </div>
  );
}
