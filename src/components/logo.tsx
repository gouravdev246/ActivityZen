import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("h-6 w-6", props.className)}
    {...props}
  >
    <rect width="24" height="24" rx="4" ry="4" className="text-foreground" />
    <path d="m9 12 2 2 4-4" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default Logo;
