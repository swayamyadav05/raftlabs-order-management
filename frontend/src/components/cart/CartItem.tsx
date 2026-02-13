"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { menuItem, quantity } = item;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative size-16 shrink-0 rounded-md overflow-hidden">
          <Image
            src={menuItem.image}
            alt={menuItem.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-medium truncate">{menuItem.name}</h3>
          <p className="text-sm text-muted-foreground">
            ${menuItem.price.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)}
          >
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
          >
            <Plus />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-destructive"
          onClick={() => onRemove(menuItem.id)}
        >
          <Trash2 />
        </Button>
        <span className="w-20 text-right font-medium shrink-0">
          ${(menuItem.price * quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
