"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartContext } from "@/hooks/CartProvider";

export function CartIcon() {
  const { totalItems, mounted } = useCartContext();

  return (
    <Link href="/cart" className="relative inline-flex items-center p-2 hover:opacity-70 transition-opacity">
      <ShoppingCart className="size-5" />
      {mounted && totalItems > 0 && (
        <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center rounded-full p-0 text-[10px]">
          {totalItems}
        </Badge>
      )}
    </Link>
  );
}
