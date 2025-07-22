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
        className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
      >
        Movies
      </Link>
      <Link
        to="/movies-with-actors"
        className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
      >
        Movies with Actors
      </Link>
      <Link
        to="/add-movie"
        className="mr-4 text-green-600 hover:text-green-800 transition-colors font-medium"
      >
        + Add Movie
      </Link>
      <Link
        to="/actors"
        className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
      >
        Actors
      </Link>
      <Link
        to="/actors-with-movies"
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        Actors with Movies
      </Link>
    </nav>
  );
}
