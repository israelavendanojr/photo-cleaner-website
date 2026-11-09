import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "That email address is too long.")
  .pipe(z.email("Enter a valid email, like you@example.com."));

export type EmailValidation = { ok: true; email: string } | { ok: false; message: string };

export function validateEmail(input: string): EmailValidation {
  const result = emailSchema.safeParse(input);
  if (result.success) return { ok: true, email: result.data };
  return { ok: false, message: result.error.issues[0]?.message ?? "Enter a valid email." };
}

/** Server-side normalization: the same rules as the form, plus lowercasing for storage. */
export function normalizeEmail(input: string): EmailValidation {
  const result = validateEmail(input);
  return result.ok ? { ok: true, email: result.email.toLowerCase() } : result;
}
