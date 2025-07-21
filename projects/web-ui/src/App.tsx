import { Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Movies } from "./pages/Movies";
import { MovieDetail } from "./pages/MovieDetail";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <div>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
        </Routes>
      </main>
    </div>
  );
}
