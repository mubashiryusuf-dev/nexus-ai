import type { ReactNode } from "react";

interface IconProps {
  className?: string;
}

function Svg({
  children,
  className = "h-4 w-4",
  viewBox = "0 0 24 24"
}: IconProps & { children: ReactNode; viewBox?: string }): JSX.Element {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function SearchIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6" strokeWidth="1.8" />
      <path d="m20 20-4.2-4.2" strokeLinecap="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function MicIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M12 4a2.5 2.5 0 0 0-2.5 2.5v5a2.5 2.5 0 0 0 5 0v-5A2.5 2.5 0 0 0 12 4Z" strokeWidth="1.8" />
      <path d="M6.5 10.5a5.5 5.5 0 0 0 11 0M12 16v4M9 20h6" strokeLinecap="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function PaperclipIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="m9.5 12.5 5.4-5.4a3 3 0 1 1 4.2 4.2l-7.2 7.2a5 5 0 0 1-7-7L12 4.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function ImageIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <rect height="14" rx="2.5" strokeWidth="1.8" width="18" x="3" y="5" />
      <circle cx="9" cy="10" r="1.5" strokeWidth="1.8" />
      <path d="m6 17 4.2-4.2a1 1 0 0 1 1.4 0L15 16l2.2-2.2a1 1 0 0 1 1.4 0L20 15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function VideoIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <rect height="10" rx="2.5" strokeWidth="1.8" width="11" x="4" y="7" />
      <path d="m15 10 4-2v8l-4-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function ScreenIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <rect height="10" rx="2.5" strokeWidth="1.8" width="14" x="5" y="6" />
      <path d="M8 19h8M12 16v3" strokeLinecap="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function SparkleIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function RobotIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <rect height="8" rx="2" strokeWidth="1.8" width="12" x="6" y="7" />
      <path d="M10 15v2m4-2v2M9 19h6M12 7V4" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="10" cy="11" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function GlobeIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
      <path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" strokeWidth="1.4" />
    </Svg>
  );
}

export function BrainIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M9 6a3 3 0 0 1 5.5-1.7A3.2 3.2 0 0 1 18 7.5 3 3 0 0 1 17 13a3.5 3.5 0 0 1-5.8 2.7A3.5 3.5 0 0 1 6 13a3.1 3.1 0 0 1 .7-6.1A3 3 0 0 1 9 6Z" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="M10 7.5v8M14 8.5v6M10 11h4" strokeLinecap="round" strokeWidth="1.6" />
    </Svg>
  );
}

export function ShieldIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M12 4 18 6v5c0 4-2.5 6.8-6 9-3.5-2.2-6-5-6-9V6l6-2Z" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function BoltIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M13 3 6.5 13h4l-1 8L17.5 11h-4L13 3Z" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function LockIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <rect height="9" rx="2" strokeWidth="1.8" width="12" x="6" y="10" />
      <path d="M8.5 10V8a3.5 3.5 0 1 1 7 0v2" strokeWidth="1.8" />
    </Svg>
  );
}

export function BookmarkIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M7 5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V20l-5-3-5 3V5.5Z" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function ShareIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M14 7 21 3m0 0-1 7m1-7-8 8M10 6H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function PaletteIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M12 4a8 8 0 0 0 0 16h1.2a1.8 1.8 0 0 0 1.8-1.8c0-.9-.6-1.7-.6-2.2 0-.8.5-1.2 1.3-1.2H17a5 5 0 0 0 0-10h-5Z" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="8" cy="11" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="10" cy="8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="8" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function WrenchIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="m14 7 3-3 3 3-3 3m-3-3 6 6-7 7-6-6 7-7Z" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="m4 20 4-4" strokeLinecap="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function RocketIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M14.5 4.5c2.5 1 4.5 3 5 5-2 .5-4.3 1-6.7 3.4-2.5 2.5-3 4.7-3.5 6.8-2-.5-4-2.5-5-5 .8-1.8 1.7-4 4.1-6.4 2.4-2.4 4.6-3.3 6.1-3.8Z" strokeLinejoin="round" strokeWidth="1.6" />
      <circle cx="14.5" cy="9.5" r="1.2" strokeWidth="1.6" />
      <path d="m6 18-2 2m2-6-3 1m7 5 1-3" strokeLinecap="round" strokeWidth="1.6" />
    </Svg>
  );
}

export function ChartIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M5 19V9m7 10V5m7 14v-7" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M4 19h16" strokeLinecap="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function DocumentIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M8 4.5h6l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V6a1.5 1.5 0 0 1 1-1.5Z" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M14 4.5V8h3M9.5 13h5M9.5 16h5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function CoinIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="7" strokeWidth="1.8" />
      <path d="M12 8v8m2.2-6.2c-.5-.5-1.2-.8-2.2-.8-1.6 0-2.7.8-2.7 2 0 1 .7 1.6 2.2 2l1 .3c1.3.4 2 .9 2 2 0 1.3-1.1 2.2-2.8 2.2-1.1 0-2.1-.3-2.9-1" strokeLinecap="round" strokeWidth="1.6" />
    </Svg>
  );
}

export function BookIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H19v14H7.5A2.5 2.5 0 0 0 5 20.5v-14Z" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M9 8h6M9 12h6" strokeLinecap="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function EyeIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" strokeWidth="1.8" />
    </Svg>
  );
}

export function SendIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M20 4 9 15" strokeLinecap="round" strokeWidth="1.8" />
      <path d="m20 4-7 16-3.5-6-5.5-3.5L20 4Z" strokeLinejoin="round" strokeWidth="1.8" />
    </Svg>
  );
}

export function FilterIcon({ className }: IconProps): JSX.Element {
  return (
    <Svg className={className}>
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" strokeWidth="1.8" />
    </Svg>
  );
}
