import type { SVGProps } from "react";

// Stroke icons drawn on a 24px grid; they take the text colour.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
);
export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></Icon>
);
export const UploadIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 16V4M6 10l6-6 6 6M4 20h16" /></Icon>
);
export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}><path d="M15 18l-6-6 6-6" /></Icon>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);
export const UndoIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></Icon>
);
export const RedoIcon = (p: IconProps) => (
  <Icon {...p}><path d="m15 14 5-5-5-5" /><path d="M20 9H9a5 5 0 0 0 0 10h3" /></Icon>
);
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
);
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 6l12 12M18 6 6 18" /></Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}><path d="m5 12 5 5L19 7" /></Icon>
);
export const FlashIcon = (p: IconProps) => (
  <Icon {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></Icon>
);
export const EyeIcon = (p: IconProps) => (
  <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>
);
export const EyeOffIcon = (p: IconProps) => (
  <Icon {...p}><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3 3.6M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.6 9.6 0 0 0 5.4-1.6" /></Icon>
);
export const LockIcon = (p: IconProps) => (
  <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>
);
export const UnlockIcon = (p: IconProps) => (
  <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></Icon>
);

// Editor tools
export const MoveIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 3v18M3 12h18M12 3 9.5 5.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5" /></Icon>
);
export const TransformIcon = (p: IconProps) => (
  <Icon {...p}><rect x="5" y="5" width="14" height="14" /><rect x="3" y="3" width="4" height="4" /><rect x="17" y="3" width="4" height="4" /><rect x="3" y="17" width="4" height="4" /><rect x="17" y="17" width="4" height="4" /></Icon>
);
export const WarpIcon = (p: IconProps) => (
  <Icon {...p}><path d="M3 6c6-3 12 3 18 0M3 12c6-3 12 3 18 0M3 18c6-3 12 3 18 0M8 4.5v15M16 4.5v15" /></Icon>
);
export const BrushIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9 14 20 3" /><path d="M3 21c3 0 6-1 6-4a3 3 0 0 0-3-3c-2 0-3 2-3 7z" /></Icon>
);
export const EraserIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 15 13 6l6 6-7 7H8z" /><path d="M8 21h12" /></Icon>
);
export const LassoIcon = (p: IconProps) => (
  <Icon {...p}><ellipse cx="12" cy="10" rx="8" ry="5.5" /><path d="M8 15c-2 2 0 5 2.5 6" /></Icon>
);
export const WandIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 20 15 9" /><path d="M15 3v3M19 5l-2 2M21 9h-3M13 5l1 1" /></Icon>
);
export const TextIcon = (p: IconProps) => (
  <Icon {...p}><path d="M5 5h14M12 5v14M9 19h6" /></Icon>
);
export const EyedropperIcon = (p: IconProps) => (
  <Icon {...p}><path d="m14 4 6 6M17 7 7 17l-3 1 1-3L15 5" /></Icon>
);
export const CropIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 2v16h16M2 6h16v16" /></Icon>
);
export const RulerIcon = (p: IconProps) => (
  <Icon {...p}><rect x="2" y="8" width="20" height="8" rx="1" /><path d="M6 8v3M10 8v4M14 8v3M18 8v4" /></Icon>
);
