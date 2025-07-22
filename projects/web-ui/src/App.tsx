import { Route, Routes } from "react-router-dom";
import { Navigation } from "@/components";
import {
  Actors,
  ActorDetail,
  Home,
  MovieDetail,
  Movies,
  MoviesWithActors,
} from "@/pages";

export default function App() {
  return (
    <div>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies-with-actors" element={<MoviesWithActors />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actors/:id" element={<ActorDetail />} />
        </Routes>
      </main>
    </div>
  );
}
