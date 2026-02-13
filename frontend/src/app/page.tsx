import { MenuGrid } from "@/components/menu/MenuGrid";

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Menu</h1>
        <p className="text-muted-foreground mt-1">
          Choose from our delicious selection
        </p>
      </div>
      <MenuGrid />
    </div>
  );
}
