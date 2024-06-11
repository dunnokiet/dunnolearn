"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { CircleGaugeIcon, CompassIcon, ListIcon } from "lucide-react";

const links = [
  { name: "Courses", href: "/courses", icon: ListIcon, role: "admin" },
  {
    name: "Browse",
    href: "/courses/search",
    icon: CompassIcon,
    role: "student",
  },
  {
    name: "Dashboard",
    href: "/courses/dashboard",
    icon: CircleGaugeIcon,
    role: ["student", "admin"],
  },
];

export function NavLinks({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const visible = link.role.includes(role);

        return (
          visible && (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                { "bg-muted": pathname === link.href },
                { "text-muted-foreground": pathname !== link.href }
              )}
            >
              <LinkIcon className="h-4 w-4" />
              {link.name}
            </a>
          )
        );
      })}
    </nav>
  );
}
