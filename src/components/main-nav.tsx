import Link from "next/link";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/calendar"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Calendar
      </Link>
      <Link
        href="/home"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/help"
        className="text-md font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Help
      </Link>
    </nav>
  );
}
