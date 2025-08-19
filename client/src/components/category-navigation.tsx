import { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryNavigation({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryNavigationProps) {
  return (
    <nav className="bg-white shadow-sm sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto py-4 space-x-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`whitespace-nowrap font-semibold border-b-2 pb-2 transition-all duration-200 flex items-center ${
                activeCategory === category.id
                  ? "border-primary text-primary"
                  : "border-transparent text-secondary hover:text-primary hover:border-primary"
              }`}
              data-testid={`category-${category.id}`}
            >
              <category.icon className="w-5 h-5 mr-2" />
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
