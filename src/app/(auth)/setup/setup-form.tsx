"use client";

import { useActionState } from "react";
import { createStudio, signOut, type FormState } from "../actions";
import styles from "../auth.module.css";

export function SetupForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createStudio, { status: "idle" });

  return (
    <>
      <div>
        <h1>Name your studio</h1>
        <p>Photos, designs and mockups are filed under it. You can invite artists later.</p>
      </div>
      <form action={action} className={styles.form}>
        <label className={styles.field}>
          Studio name
          <input name="name" required maxLength={80} autoComplete="organization" placeholder="e.g. Black Lotus Tattoo" />
        </label>
        {state.status === "error" && <p role="alert" className={styles.error}>{state.message}</p>}
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Creating…" : "Create studio"}
        </button>
      </form>
      <form action={signOut}>
        <p className={styles.fine}>
          Signed in as {email}.{" "}
          <button type="submit" className={styles.link}>
            Use another email
          </button>
        </p>
      </form>
    </>
  );
}
