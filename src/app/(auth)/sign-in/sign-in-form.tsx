"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { sendSignInLink, type FormState } from "../actions";
import styles from "../auth.module.css";

export function SignInForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<FormState, FormData>(sendSignInLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div>
        <h1>Check your email</h1>
        <p className={styles.sent}>
          We sent a sign-in link to <strong>{state.email}</strong>. Open it on this computer to continue.
        </p>
      </div>
    );
  }

  const linkFailed = params.get("error") === "link";
  return (
    <>
      <div>
        <h1>Sign in to your studio</h1>
        <p>We&apos;ll email you a link. No password to remember.</p>
      </div>
      <form action={action} className={styles.form}>
        <input type="hidden" name="next" value={params.get("next") ?? ""} />
        <label className={styles.field}>
          Work email
          <input type="email" name="email" autoComplete="email" required defaultValue={state.email} />
        </label>
        {state.status === "error" && <p role="alert" className={styles.error}>{state.message}</p>}
        {linkFailed && state.status === "idle" && (
          <p role="alert" className={styles.error}>That link has expired or was already used. Send a new one.</p>
        )}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>
      <p className={styles.fine}>New here? The same link creates your account.</p>
    </>
  );
}
