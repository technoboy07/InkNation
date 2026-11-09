import { getStudioMember } from "@/lib/auth";
import { signOut } from "../(auth)/actions";
import styles from "./studio.module.css";

export async function AccountMenu() {
  const member = await getStudioMember();
  return (
    <details className={styles.account}>
      <summary className={styles.avatar} aria-label="Account">
        {member.email.charAt(0) || "?"}
      </summary>
      <div className={styles.menu}>
        <div>
          <strong>{member.studioName}</strong>
          <span>{member.email}</span>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn">
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}
