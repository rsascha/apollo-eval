import { Route, Routes } from "react-router-dom";
import { Navigation } from "@/components";
import { Actors, Home, MovieDetail, Movies } from "@/pages";

export default function App() {
  return (
    <div>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/actors" element={<Actors />} />
        </Routes>
      </main>
    </div>
  );
}
