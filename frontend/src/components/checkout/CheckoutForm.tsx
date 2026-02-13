"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useCartContext } from "@/hooks/CartProvider";
import { api } from "@/lib/api";

interface FormErrors {
  name?: string;
  address?: string;
  phone?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartContext();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (address.trim().length < 5)
      errs.address = "Address must be at least 5 characters";
    if (!/^\d{10}$/.test(phone.trim()) && !/^\+\d{1,3}\d{10}$/.test(phone.trim()))
      errs.phone = "Enter a valid 10-digit phone number";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
        })),
        customer: {
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
        },
      });
      router.push(`/order/${order.id}`);
      clearCart();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">Delivery Details</h2>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone number"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          {items.map((item) => (
            <div
              key={item.menuItem.id}
              className="flex justify-between text-sm"
            >
              <span>
                {item.menuItem.name} x {item.quantity}
              </span>
              <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {submitError && (
        <p className="text-sm text-destructive text-center">{submitError}</p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Placing Order...
          </>
        ) : (
          `Place Order - $${totalAmount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}
