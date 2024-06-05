import { CreateForm } from "@/components/courses/create/create-form";

export default function Page() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <h1 className="text-xl font-semibold">Courses</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <CreateForm />
      </main>
    </div>
  );
}
