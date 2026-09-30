import * as React from "react";

type Props = React.SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CheckIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}

export function CheckCircleIcon(props: Props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5" />
    </Icon>
  );
}

export function XCircleIcon(props: Props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </Icon>
  );
}

export function ArrowRightIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function MenuIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function CloseIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  );
}

export function DashboardIcon(props: Props) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="5" rx="1.6" />
      <rect x="13.5" y="11" width="7.5" height="10" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </Icon>
  );
}

export function OrdersIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M8 4h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 22H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 4Z" />
      <path d="M9.5 2.8h5v3h-5zM9.5 11h5M9.5 15h3.5" />
    </Icon>
  );
}

export function PackageIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="m12 3 8 4.4v9.2L12 21l-8-4.4V7.4z" />
      <path d="M4 7.4 12 11.8l8-4.4M12 11.8V21" />
    </Icon>
  );
}

export function UsersIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

export function ChartIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12.5 16V8M17 16v-6" />
    </Icon>
  );
}

export function GlobeIcon(props: Props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </Icon>
  );
}

export function LinkIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2.1-2.1a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" />
      <path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2.1 2.1a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />
    </Icon>
  );
}

export function MessageIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.8A8.5 8.5 0 1 1 21 11.5Z" />
    </Icon>
  );
}

export function NoteIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h11v17h-11z" />
      <path d="M6.5 8H4M6.5 12H4M6.5 16H4M10 8h4M10 12h4" />
    </Icon>
  );
}

export function CalculatorIcon(props: Props) {
  return (
    <Icon {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 19h7" />
    </Icon>
  );
}

export function ShieldIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M12 3 5 5.8v5.4c0 4.2 2.9 7.5 7 8.8 4.1-1.3 7-4.6 7-8.8V5.8Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Icon>
  );
}

export function SparklesIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="m12 4 1.7 4.6L18.3 10l-4.6 1.7L12 16.3l-1.7-4.6L5.7 10l4.6-1.4z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </Icon>
  );
}

export function HeadsetIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5h2.8c.4 0 .7.3.7.7v3.6c0 .4-.3.7-.7.7H6a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M19.5 13.5h-2.8c-.4 0-.7.3-.7.7v3.6c0 .4.3.7.7.7H18a1.5 1.5 0 0 0 1.5-1.5Z" />
    </Icon>
  );
}

export function WasherIcon(props: Props) {
  return (
    <Icon {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M4 8h16M7.5 5.5h.01M10.5 5.5h.01" />
      <circle cx="12" cy="14.5" r="4" />
      <path d="M9.4 13.4a3.2 3.2 0 0 1 2.6-1.5" />
    </Icon>
  );
}

export function CameraIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M4 8.5h2.6l1.7-2.2h7.4l1.7 2.2H20a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.8" r="3.4" />
    </Icon>
  );
}

export function CakeIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M4.5 20.5v-5.7A3.8 3.8 0 0 1 8.3 11h7.4a3.8 3.8 0 0 1 3.8 3.8v5.7Z" />
      <path d="M4.5 17.4c1.4.9 2.7.9 4 0s2.6-.9 4 0 2.7.9 4 0 2.6-.9 3-.6" />
      <path d="M12 11V8.4M8.4 11V9M15.6 11V9" />
    </Icon>
  );
}

export function BagIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="M6 7.5h12l-1 12.2a1.5 1.5 0 0 1-1.5 1.3H8.5A1.5 1.5 0 0 1 7 19.7Z" />
      <path d="M9 9.5V7a3 3 0 0 1 6 0v2.5" />
    </Icon>
  );
}

export function ClockIcon(props: Props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </Icon>
  );
}

export function TrendIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="m4 16.5 5.2-5.2 3.4 3.4L20 7.5" />
      <path d="M15 7.5h5v5" />
    </Icon>
  );
}

export function ChevronDownIcon(props: Props) {
  return (
    <Icon {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Icon>
  );
}
