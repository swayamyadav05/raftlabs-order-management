"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useCartContext } from "@/hooks/CartProvider";

export default function CheckoutPage() {
  const { items, mounted } = useCartContext();
  const router = useRouter();
  const hasRenderedWithItems = useRef(false);

  if (items.length > 0) {
    hasRenderedWithItems.current = true;
  }

  useEffect(() => {
    // Only redirect if the cart was NEVER populated during this page's lifetime.
    // If items were present and then cleared, an order was placed and
    // CheckoutForm already called router.push — don't override it.
    if (mounted && items.length === 0 && !hasRenderedWithItems.current) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  if (!mounted || (items.length === 0 && !hasRenderedWithItems.current)) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href="/cart">
            <ArrowLeft className="size-4" /> Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
