"use server";

import { redirect } from "next/navigation";
import {
  checkCredentials,
  clearLoginFailures,
  isLoginLocked,
  recordLoginFailure,
} from "@/lib/admin/auth";
import { createAdminSession, destroyAdminSession } from "@/lib/admin/session";
import { getAdminEnv } from "@/lib/env";
import { getIpHash } from "@/lib/form-guard";

export type LoginState = {
  error?: string;
  /** Echoed back so the form reset keeps it. */ email?: string;
};

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!getAdminEnv()) {
    return { error: "The admin dashboard isn't configured. Set ADMIN_EMAIL and ADMIN_PASSWORD." };
  }
  const email = String(formData.get("email") ?? "");
  const key = await getIpHash();
  if (isLoginLocked(key)) {
    return { error: "Too many failed attempts. Please wait 15 minutes and try again.", email };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(email, password)) {
    recordLoginFailure(key);
    await new Promise((resolve) => setTimeout(resolve, 700)); // slow down guessing
    return { error: "Incorrect email or password.", email };
  }

  clearLoginFailures(key);
  await createAdminSession(getAdminEnv()!.email);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
