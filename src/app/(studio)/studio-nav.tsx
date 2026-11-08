"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./studio.module.css";

const LINKS = [
  { href: "/uploads", label: "Uploads" },
  { href: "/mockups", label: "Mockups" },
  { href: "/clients", label: "Clients" },
  { href: "/flash", label: "Flash" },
] as const;

export function StudioNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className={styles.nav}>
      {LINKS.map((link) => {
        const current = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={current ? `${styles.navLink} ${styles.navLinkCurrent}` : styles.navLink}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
