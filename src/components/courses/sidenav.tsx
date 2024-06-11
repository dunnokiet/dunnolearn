import Link from "next/link";
import { NavLinks } from "./nav-link";

import { Button } from "@/components/ui/button";
import { CommandLineIcon } from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

export function SideNav({ role }: { role: string }) {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <CommandLineIcon className="h-8 w-8" />
          <span className="">Dunnolearn</span>
        </Link>
        <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
          <BellAlertIcon className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className="flex-1">
        <NavLinks role={role} />
      </div>
    </div>
  );
}
