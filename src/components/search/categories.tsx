import CategoryItem from "./categories-item";

export default function Categories({ items }: { items: any }) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item: any) => (
        <CategoryItem key={item.id} label={item.name} value={item.id} />
      ))}
    </div>
  );
}
