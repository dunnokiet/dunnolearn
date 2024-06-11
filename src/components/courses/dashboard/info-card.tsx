import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props {
  count: number;
  label: string;
  Icon: LucideIcon;
  color: "blue" | "green";
}

export default function InfoCard({ count, color, label, Icon }: Props) {
  return (
    <div className="border rounded-md flex item items-center gap-x-2 p-3">
      <Icon className="h-10 w-10" color={color} />
      <div className="font-medium">
        <p>{label}</p>
        <p>
          {count} {count === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
}
