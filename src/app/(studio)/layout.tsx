import Link from "next/link";
import { Logo } from "@/components/logo";
import { PhoneIcon, SearchIcon } from "@/components/icons";
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
          <button type="button" className={styles.avatar} aria-label="Account">
            D
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
