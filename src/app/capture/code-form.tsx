"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { pairWithCode, type PairState } from "./actions";
import styles from "./capture.module.css";

export function CodeForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<PairState, FormData>(pairWithCode, {});
  const error =
    state.error ?? (params.get("error") === "expired" ? "That QR code has expired or was already used. Scan the new one." : null);

  return (
    <form action={action} className={styles.codeForm}>
      <label htmlFor="pair-code">Or type the 6-digit code</label>
      <input
        id="pair-code"
        name="code"
        className={styles.codeInput}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]*"
        maxLength={7}
        placeholder="000 000"
        required
      />
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <button type="submit" className={`btn btn-primary ${styles.tall}`} disabled={pending}>
        {pending ? "Pairing…" : "Pair this phone"}
      </button>
    </form>
  );
}
