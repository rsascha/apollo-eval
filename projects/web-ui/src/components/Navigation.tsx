import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      <Link to="/movies">Movies</Link>
    </nav>
  );
}
