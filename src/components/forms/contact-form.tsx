"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitInquiry } from "@/app/contact/actions";
import { initialContactState, type ContactFieldName } from "@/app/contact/state";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { shopConfig } from "@/lib/site-config";
import {
  BUSINESS_TYPES,
  contactSchema,
  INQUIRY_TYPES,
  type InquiryTypeValue,
} from "@/lib/validators/contact";

type FieldErrors = Partial<Record<ContactFieldName, string>>;

const successCopy: Record<InquiryTypeValue, string> = {
  general: "Thank you — we've received your message and will get back to you.",
  order_help: "Thank you — we've received your message and will get back to you about your order.",
  business:
    "Thank you — we've received your business enquiry and will be in touch to discuss supply and pricing.",
  sample:
    "Thank you — we've received your sample request. Samples are subject to availability. We will confirm the delivery arrangements and any applicable charge before sending.",
  visit: `Thank you — we've noted your interest. Factory visits are planned from ${shopConfig.factoryVisitsFrom}; we'll confirm opening dates, activities and booking arrangements before visits begin.`,
};

export function ContactForm({
  initialType,
  product,
  formToken,
}: {
  initialType: InquiryTypeValue;
  product?: { slug: string; name: string };
  formToken: string;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialContactState);
  const [type, setType] = useState<InquiryTypeValue>(initialType);
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors: FieldErrors = clientErrors ?? state.fieldErrors ?? {};
  const value = (name: string) => state.values?.[name] ?? "";
  const showBusiness = type === "business" || type === "sample";

  useEffect(() => {
    const first = Object.keys(errors)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.fieldErrors, clientErrors]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border-gold/60 bg-ivory rounded-2xl border p-8 text-center sm:p-12"
      >
        <CheckCircle2 aria-hidden className="text-forest mx-auto size-12" strokeWidth={1.4} />
        <h2 className="text-forest mt-5 text-3xl">Message sent</h2>
        <p className="text-muted mx-auto mt-4 max-w-md">
          {successCopy[state.submittedType ?? "general"]}
        </p>
        <ButtonLink href="/shop" variant="secondary" className="mt-8">
          Back to the shop
        </ButtonLink>
      </div>
    );
  }

  const validateOnClient = (e: React.FormEvent<HTMLFormElement>) => {
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const result = contactSchema.safeParse(raw);
    if (result.success) {
      setClientErrors(null);
      return;
    }
    e.preventDefault();
    const next: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as ContactFieldName;
      next[key] ??= issue.message;
    }
    setClientErrors(next);
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={validateOnClient}
      noValidate
      className="space-y-5"
    >
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="border-error/40 bg-error/5 text-error rounded-xl border px-5 py-4 font-medium"
        >
          {state.message}
        </div>
      )}

      {/* Anti-spam: signed render time + honeypot. Add a Turnstile widget here later. */}
      <input type="hidden" name="form_token" value={formToken} />
      {product && <input type="hidden" name="productSlug" value={product.slug} />}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {product && (
        <p className="bg-sand rounded-lg px-4 py-3 text-sm">
          Regarding: <strong className="text-forest font-semibold">{product.name}</strong>
        </p>
      )}

      <Field label="Enquiry type" name="type" error={errors.type} required>
        {(p) => (
          <select
            {...p}
            value={type}
            onChange={(e) => setType(e.target.value as InquiryTypeValue)}
            className={inputClass}
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field label="Your name" name="name" error={errors.name} required>
        {(p) => (
          <input
            {...p}
            type="text"
            autoComplete="name"
            defaultValue={value("name")}
            className={inputClass}
          />
        )}
      </Field>

      <fieldset className="space-y-5">
        <legend className="text-muted mb-1 text-sm">
          How should we reach you? Please give a phone number or an email address.
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" name="phone" error={errors.phone} hint="e.g. 077 123 4567">
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
          <Field label="Email" name="email" error={errors.email}>
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
        </div>
      </fieldset>

      {showBusiness && (
        <fieldset className="border-line bg-ivory space-y-5 rounded-xl border p-5">
          <legend className="text-forest px-1 font-serif text-lg">About your business</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name" name="businessName" error={errors.businessName} optional>
              {(p) => (
                <input
                  {...p}
                  type="text"
                  autoComplete="organization"
                  defaultValue={value("businessName")}
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Business type" name="businessType" error={errors.businessType} optional>
              {(p) => (
                <select {...p} defaultValue={value("businessType")} className={inputClass}>
                  <option value="">Select</option>
                  {BUSINESS_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Location" name="location" error={errors.location} optional>
              {(p) => (
                <input {...p} type="text" defaultValue={value("location")} className={inputClass} />
              )}
            </Field>
            <Field
              label="Approx. monthly tea usage"
              name="monthlyUsage"
              error={errors.monthlyUsage}
              optional
            >
              {(p) => (
                <input
                  {...p}
                  type="text"
                  defaultValue={value("monthlyUsage")}
                  className={inputClass}
                />
              )}
            </Field>
          </div>
        </fieldset>
      )}

      <Field
        label="Message"
        name="message"
        error={errors.message}
        optional={type !== "general" && type !== "order_help"}
        required={type === "general" || type === "order_help"}
      >
        {(p) => <textarea {...p} rows={5} defaultValue={value("message")} className={inputClass} />}
      </Field>

      <Button type="submit" size="lg" disabled={pending}>
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
