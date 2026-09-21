"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { placeOrder } from "@/app/checkout/actions";
import { initialCheckoutState } from "@/app/checkout/state";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, inputClass } from "@/components/ui/field";
import { formatLkr } from "@/lib/format";
import { SRI_LANKA_DISTRICTS } from "@/lib/districts";
import { cartItemsSchema, checkoutSchema, type CheckoutFieldName } from "@/lib/validators/checkout";

type FieldErrors = Partial<Record<CheckoutFieldName, string>>;

export function CheckoutForm({
  payment,
  deliveryFeeMinor,
}: {
  payment: { label: string; description: string };
  deliveryFeeMinor: number | null;
}) {
  const { lines, subtotal } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialCheckoutState);
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const [cartProblem, setCartProblem] = useState(false);
  // One key per checkout attempt: created at first submit (never during render, so server and
  // client markup match) and reused on retries so a double submit can't create two orders.
  const idempotencyKey = useRef("");
  const formRef = useRef<HTMLFormElement>(null);

  const buyable = lines.filter((l) => l.item.purchasable);
  const errors: FieldErrors = clientErrors ?? state.fieldErrors ?? {};
  const value = (name: string) => state.values?.[name] ?? "";
  const total = subtotal + (deliveryFeeMinor ?? 0);

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    const first = Object.keys(errors)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.fieldErrors, clientErrors]);

  if (buyable.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        action={<ButtonLink href="/shop">Shop tea</ButtonLink>}
      >
        Add something to your cart before checking out.
      </EmptyState>
    );
  }

  const items = JSON.stringify(buyable.map((l) => ({ productId: l.productId, qty: l.qty })));

  // Same Zod schema the server uses, so customers get instant, identical messages.
  const validateOnClient = (e: React.FormEvent<HTMLFormElement>) => {
    idempotencyKey.current ||= crypto.randomUUID();
    const keyInput = e.currentTarget.elements.namedItem("idempotencyKey") as HTMLInputElement;
    keyInput.value = idempotencyKey.current;
    const data = new FormData(e.currentTarget);
    const result = checkoutSchema.safeParse(Object.fromEntries(data));
    const itemsOk = cartItemsSchema.safeParse(JSON.parse(items)).success;
    setCartProblem(!itemsOk);
    if (result.success && itemsOk) {
      setClientErrors(null);
      return;
    }
    e.preventDefault();
    const next: FieldErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as CheckoutFieldName;
        next[key] ??= issue.message;
      }
    }
    setClientErrors(next);
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={validateOnClient}
      noValidate
      className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:items-start"
    >
      <input type="hidden" name="items" value={items} />
      <input type="hidden" name="idempotencyKey" defaultValue="" />

      <div className="space-y-12">
        {(cartProblem || (state.status === "error" && state.message)) && (
          <div
            role="alert"
            className="border-error/40 bg-error/5 text-error rounded-xl border px-5 py-4 font-medium"
          >
            {cartProblem
              ? "Something is wrong with your cart. Please review your cart and try again."
              : state.message}
          </div>
        )}

        <fieldset className="space-y-5">
          <legend className="text-forest font-serif text-2xl">Contact</legend>
          <Field label="Full name" name="fullName" error={errors.fullName} required>
            {(p) => (
              <input
                {...p}
                type="text"
                autoComplete="name"
                defaultValue={value("fullName")}
                className={inputClass}
              />
            )}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" name="email" error={errors.email} required>
              {(p) => (
                <input
                  {...p}
                  type="email"
                  autoComplete="email"
                  defaultValue={value("email")}
                  className={inputClass}
                />
              )}
            </Field>
            <Field
              label="Phone"
              name="phone"
              error={errors.phone}
              hint="e.g. 077 123 4567"
              required
            >
              {(p) => (
                <input
                  {...p}
                  type="tel"
                  autoComplete="tel"
                  defaultValue={value("phone")}
                  className={inputClass}
                />
              )}
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="text-forest font-serif text-2xl">Delivery address</legend>
          <Field label="Address line 1" name="addressLine1" error={errors.addressLine1} required>
            {(p) => (
              <input
                {...p}
                type="text"
                autoComplete="address-line1"
                defaultValue={value("addressLine1")}
                className={inputClass}
              />
            )}
          </Field>
          <Field label="Address line 2" name="addressLine2" error={errors.addressLine2} optional>
            {(p) => (
              <input
                {...p}
                type="text"
                autoComplete="address-line2"
                defaultValue={value("addressLine2")}
                className={inputClass}
              />
            )}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" name="city" error={errors.city} required>
              {(p) => (
                <input
                  {...p}
                  type="text"
                  autoComplete="address-level2"
                  defaultValue={value("city")}
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="District" name="district" error={errors.district} required>
              {(p) => (
                <select {...p} defaultValue={value("district")} className={inputClass}>
                  <option value="">Select district</option>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
          <Field
            label="Postal code"
            name="postalCode"
            error={errors.postalCode}
            required
            className="sm:max-w-48"
          >
            {(p) => (
              <input
                {...p}
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                defaultValue={value("postalCode")}
                className={inputClass}
              />
            )}
          </Field>
          <Field label="Order notes" name="notes" error={errors.notes} optional>
            {(p) => (
              <textarea {...p} rows={3} defaultValue={value("notes")} className={inputClass} />
            )}
          </Field>
        </fieldset>

        <section aria-labelledby="payment-heading" className="space-y-4">
          <h2 id="payment-heading" className="text-forest font-serif text-2xl">
            Payment
          </h2>
          <div className="border-gold/60 bg-ivory flex gap-4 rounded-xl border p-5">
            <ShieldCheck aria-hidden className="text-forest mt-0.5 size-6 shrink-0" />
            <div>
              <p className="text-forest font-medium">{payment.label}</p>
              <p className="text-muted mt-1 text-sm">{payment.description}</p>
            </div>
          </div>
        </section>
      </div>

      <aside
        aria-label="Order summary"
        className="border-line bg-ivory rounded-2xl border p-6 lg:sticky lg:top-28"
      >
        <h2 className="text-forest text-2xl">Order summary</h2>
        <ul className="divide-line mt-5 divide-y">
          {buyable.map(({ productId, qty, item, lineTotal }) => (
            <li key={productId} className="flex gap-3 py-3">
              <div className="bg-cream relative size-16 shrink-0 overflow-hidden rounded-md">
                {item.image && (
                  <Image src={item.image.src} alt="" fill sizes="64px" className="object-contain" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="text-forest font-medium">{item.name}</p>
                <p className="text-muted">Qty {qty}</p>
              </div>
              <p className="text-sm font-medium whitespace-nowrap">{formatLkr(lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="border-line mt-4 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatLkr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd>
              {deliveryFeeMinor === null ? "Confirmed by our team" : formatLkr(deliveryFeeMinor)}
            </dd>
          </div>
          <div className="border-line flex justify-between border-t pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatLkr(total)}</dd>
          </div>
        </dl>
        {deliveryFeeMinor === null && (
          <p className="text-muted mt-3 text-xs">
            We&apos;ll confirm delivery arrangements and any applicable charge before dispatch.
          </p>
        )}
        <Button type="submit" size="lg" fullWidth className="mt-6" disabled={pending}>
          {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {pending ? "Placing order…" : "Place order"}
        </Button>
        <p className="text-muted mt-3 text-center text-xs">
          By placing your order you agree to our{" "}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}
