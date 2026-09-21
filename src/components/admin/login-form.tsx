"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";
import { SubmitButton } from "@/components/admin/ui";
import { Field, inputClass } from "@/components/ui/field";

export function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p
          role="alert"
          className="border-error/40 bg-error/10 text-error rounded-xl border px-4 py-3 text-sm font-medium"
        >
          {state.error}
        </p>
      )}
      <Field label="Email" name="email" required>
        {(p) => (
          <input
            {...p}
            type="email"
            autoComplete="username"
            defaultValue={state.email ?? ""}
            required
            className={inputClass}
          />
        )}
      </Field>
      <Field label="Password" name="password" required>
        {(p) => (
          <input
            {...p}
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        )}
      </Field>
      <SubmitButton size="md" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
