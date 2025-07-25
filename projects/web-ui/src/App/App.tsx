import { Route, Routes } from "react-router-dom";
import { Navigation } from "@/components";
import {
  Actors,
  ActorDetail,
  ActorsWithMovies,
  AddMovie,
  Home,
  MovieDetail,
  Movies,
  MoviesWithActors,
} from "@/pages";
import { useRefetch } from "./hooks";

export function App() {
  useRefetch();
  return (
    <div>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies-with-actors" element={<MoviesWithActors />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/actors-with-movies" element={<ActorsWithMovies />} />
          <Route path="/actors/:id" element={<ActorDetail />} />
        </Routes>
      </main>
    </div>
  );
}
