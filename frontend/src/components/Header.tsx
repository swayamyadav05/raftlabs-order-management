"use client";

import Link from "next/link";
import { CartIcon } from "./cart/CartIcon";
import { UtensilsCrossed } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <UtensilsCrossed className="size-5" />
          FoodDash
        </Link>
        <CartIcon />
      </div>
    </header>
  );
}
