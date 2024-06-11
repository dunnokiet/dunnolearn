import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
export default function HomeCard({ courses }: { courses: any }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((item: any) => (
        <Card key={item.id}>
          <Link href={`/courses/${item.id}`}>
            <Image
              src={item.imageURL}
              width="400"
              height="225"
              alt="Course Image"
              className="rounded-t-lg object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-500">{item.description}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
