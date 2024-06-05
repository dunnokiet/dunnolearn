"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CategoryItem({
  label,
  value,
}: {
  label: any;
  value: any;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <Button onClick={onClick} variant={isSelected ? "default" : "outline"}>
      {label}
    </Button>
  );
}
