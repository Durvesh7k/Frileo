
import { Link } from "react-router-dom";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      to={`/gigs?category=${category.name}`} 
      className="block category-card"
    >
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
        <p className="text-sm text-gray-500">{category.description}</p>
      </div>
    </Link>
  );
}
