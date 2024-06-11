import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

export default function Download({ attachments }: { attachments: any }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <h2 className="text-2xl font-bold">Attachments</h2>
      <div className="mt-4 space-y-4">
        {attachments.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <File className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.id}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <a href={item.URL} target="_blank">
                Download
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
