import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="p-4 border-b border-gray-300">
      <Link
        to="/"
        className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
      >
        Home
      </Link>
      <Link
        to="/movies"
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        Movies
      </Link>
    </nav>
  );
}
