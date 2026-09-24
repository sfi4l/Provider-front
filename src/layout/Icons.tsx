import type { ScreenKey } from "../types";

const stroke = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Icon({ d }: { d: string }) {
  return (
    <svg {...stroke}>
      <path d={d} />
    </svg>
  );
}

const PATHS: Record<ScreenKey, string> = {
  overview: "M2.5 8.5 8 3l5.5 5.5V13a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1z",
  catalog: "M3 4.5h10M3 8h10M3 11.5h6",
  cart: "M2.5 3.5h2l1 8h7.5l1.5-6H5M6.5 13.5h.1M11.5 13.5h.1",
  topup: "M8 3.5v9M3.5 8h9",
  transactions: "M3 4.5h10M3 8h10M3 11.5h10",
  orders: "M4 3.5h8v9H4zM6 6h4M6 8.5h4",
  direct: "M3 8h10M10 5l3 3-3 3",
  staff: "M8 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 13a4 4 0 0 1 8 0",
  api: "M5 5.5 2.5 8 5 10.5M11 5.5 13.5 8 11 10.5M9 4 7 12",
  docs: "M4.5 3.5h7v9h-7zM6.5 6h3M6.5 8.5h3",
  settings: "M8 10.2A2.2 2.2 0 1 0 8 5.8a2.2 2.2 0 0 0 0 4.4zM8 2.5v1.2M8 12.3v1.2M3.3 4.6l.9.9M11.8 10.5l.9.9M2.5 8h1.2M12.3 8h1.2M3.3 11.4l.9-.9M11.8 5.5l.9-.9",
};

export function NavIcon({ screen }: { screen: ScreenKey }) {
  return <Icon d={PATHS[screen]} />;
}

export function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path
        d="M4.2 7.4a4.8 4.8 0 019.6 0c0 3.2 1.2 4.3 1.2 4.3H3s1.2-1.1 1.2-4.3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7.2 14.2a1.8 1.8 0 003.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevIcon() {
  return (
    <svg className="account-chev" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.4 4.4L6 8l3.6-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GroupChev() {
  return (
    <svg className="chev" width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M2.4 4.4L6 8l3.6-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.6v1.5M8 12.9v1.5M1.6 8h1.5M12.9 8h1.5M3.25 3.25l1.05 1.05M11.7 11.7l1.05 1.05M3.25 12.75l1.05-1.05M11.7 4.3l1.05-1.05"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.1 9.55A5.35 5.35 0 1 1 6.45 2.9 4.15 4.15 0 0 0 13.1 9.55z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WalletIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2.2" y="4.2" width="11.6" height="8.6" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.2 6.6h11.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11.1" cy="9.6" r="1" fill="currentColor" />
    </svg>
  );
}

