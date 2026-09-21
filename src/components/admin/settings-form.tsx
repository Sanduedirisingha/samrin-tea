"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsState } from "@/app/admin/(panel)/settings/actions";
import { AdminCard, Notice } from "@/components/admin/parts";
import { SubmitButton } from "@/components/admin/ui";
import { Field, inputClass } from "@/components/ui/field";
import type { StoreSettings } from "@/lib/data/settings";

export function SettingsForm({ initial }: { initial: StoreSettings }) {
  const [state, action] = useActionState<SettingsState, FormData>(saveSettings, { status: "idle" });
  const errors = state.fieldErrors ?? {};
  return (
    <form action={action} className="max-w-2xl space-y-6">
      {state.status === "saved" && <Notice>{state.message}</Notice>}
      {state.status === "error" && <Notice tone="error">{state.message}</Notice>}

      <AdminCard title="Delivery">
        <Field
          label="Flat delivery fee (LKR)"
          name="deliveryFeeLkr"
          error={errors.deliveryFeeLkr}
          hint="Leave empty to charge nothing online — checkout then says delivery is confirmed by our team."
        >
          {(p) => (
            <input
              {...p}
              type="text"
              inputMode="decimal"
              defaultValue={initial.deliveryFeeLkr ?? ""}
              placeholder="e.g. 350"
              className={inputClass}
            />
          )}
        </Field>
      </AdminCard>

      <AdminCard title="Contact details shown on the website">
        <div className="space-y-5">
          <Field
            label="Contact email"
            name="contactEmail"
            error={errors.contactEmail}
            hint="Shown on the Contact page. Leave empty to hide it."
          >
            {(p) => (
              <input
                {...p}
                type="email"
                defaultValue={initial.contactEmail ?? ""}
                className={inputClass}
              />
            )}
          </Field>
          <Field
            label="WhatsApp number"
            name="whatsappNumber"
            error={errors.whatsappNumber}
            hint="Digits with country code, e.g. 94771234567. Leave empty to hide it."
          >
            {(p) => (
              <input
                {...p}
                type="text"
                inputMode="numeric"
                defaultValue={initial.whatsappNumber ?? ""}
                className={inputClass}
              />
            )}
          </Field>
        </div>
      </AdminCard>

      <SubmitButton size="md">Save settings</SubmitButton>
    </form>
  );
}
