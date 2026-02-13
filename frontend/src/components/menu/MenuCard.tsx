"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Check } from "lucide-react";
import { useCartContext } from "@/hooks/CartProvider";
import type { MenuItem } from "@/types";
import { useState } from "react";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem, items } = useCartContext();
  const [added, setAdded] = useState(false);
  const cartItem = items.find((i) => i.menuItem.id === item.id);

  function handleAdd() {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Badge className="absolute top-2 right-2 capitalize" variant="secondary">
          {item.category}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{item.name}</h3>
          <span className="font-bold text-nowrap">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <Button onClick={handleAdd} className="w-full" size="sm">
          {added ? (
            <>
              <Check className="size-4" /> Added
            </>
          ) : (
            <>
              <Plus className="size-4" /> Add to Cart
              {cartItem && ` (${cartItem.quantity})`}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
