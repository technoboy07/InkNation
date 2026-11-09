import Link from "next/link";
import styles from "./studio.module.css";

export function ComingSoon({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className={styles.placeholder}>
      <h1>{title}</h1>
      <p>{children}</p>
      <Link href="/uploads">Back to Uploads</Link>
    </main>
  );
}
