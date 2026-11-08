import { Logo } from "@/components/logo";
import styles from "./auth.module.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.screen}>
      <div className={styles.card}>
        <Logo />
        {children}
      </div>
    </main>
  );
}
