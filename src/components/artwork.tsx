import type { AssetKind } from "@/lib/types";
import styles from "./artwork.module.css";

// Placeholder art until real uploads load from storage.

export function DesignArt({ size = 96, stroke = "currentColor", strokeWidth = 1.6 }: { size?: number; stroke?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <circle cx="60" cy="60" r="26" />
      <circle cx="70" cy="56" r="20" />
      <path d="M94 60H104M16 60H26M60 16V26M60 94V104M84 36L91 29M36 36L29 29M84 84L91 91M36 84L29 91" />
    </svg>
  );
}

export function BodyPhoto({ angle = 18, children }: { angle?: number; children?: React.ReactNode }) {
  return (
    <div className={styles.photo}>
      <div className={styles.limb} style={{ transform: `rotate(${angle}deg)` }}>
        {children}
      </div>
    </div>
  );
}

export function AssetArt({ kind }: { kind: AssetKind }) {
  if (kind === "design") {
    return (
      <div className={styles.design}>
        <DesignArt />
      </div>
    );
  }
  if (kind === "mockup") {
    return (
      <BodyPhoto>
        <span className={styles.inked}>
          <DesignArt size={64} stroke="#2a2420" strokeWidth={2} />
        </span>
      </BodyPhoto>
    );
  }
  return <BodyPhoto />;
}
