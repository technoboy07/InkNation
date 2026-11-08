import styles from "./logo.module.css";

export function Logo({ label = "InkNation" }: { label?: string }) {
  return (
    <span className={styles.logo}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2c3.5 5 6 8.4 6 11.5A6 6 0 0 1 6 13.5C6 10.4 8.5 7 12 2z" />
      </svg>
      {label}
    </span>
  );
}
