import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { PhoneIcon, SearchIcon } from "@/components/icons";
import { AccountMenu } from "./account-menu";
import { StudioNav } from "./studio-nav";
import styles from "./studio.module.css";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Logo />
        <StudioNav />
        <div className={styles.actions}>
          <label className={styles.search}>
            <SearchIcon size={16} />
            <span className="visually-hidden">Search</span>
            <input type="search" placeholder="Search clients, tags" />
          </label>
          <Link className="btn" href="/uploads#pair">
            <PhoneIcon size={16} />
            Pair phone
          </Link>
          <Suspense fallback={<span className={styles.avatar} aria-hidden="true" />}>
            <AccountMenu />
          </Suspense>
        </div>
      </header>
      {children}
    </div>
  );
}
