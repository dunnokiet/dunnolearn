"use client";

import { cn } from "@/lib/utils";

export default function Categories({ items }: { items: any }) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      <button
        className={cn(
          "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition"
        )}
        type="button"
      >
        {items.map((item: any) => (
          <div key={item.id} className="truncate">
            {item.name}
          </div>
        ))}
      </button>
    </div>
  );
}
