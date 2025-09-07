import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M21 3l-9 9" />
      <path d="M9 3H3v6" />
      <path d="M3 3l9 9" />
      <path d="M15 21h6v-6" />
      <path d="M21 21l-9-9" />
      <path d="M9 21H3v-6" />
      <path d="M3 21l9-9" />
    </svg>
  );
}
