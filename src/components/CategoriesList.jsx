import { Link } from 'react-router-dom';

export default function CategoriesList({ categories }) {
  return (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li key={cat.name} className="flex items-center gap-2">
          <img src={cat.icon} alt={cat.name} className="h-5 w-5" />
          <Link to={cat.link} className="text-gray-700 hover:text-blue-600">
            {cat.name}
          </Link>
        </li>
      ))}
    </ul>
  );
} 