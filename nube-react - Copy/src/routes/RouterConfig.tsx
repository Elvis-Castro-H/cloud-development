import { Route, Routes } from "react-router";
import HomePage from "../pages/HomePage";
import GenrePage from "../pages/GenrePage";
import ArtistPage from "../pages/ArtistPage";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";

export const RouterConfig = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genre/:genreId" element={<GenrePage />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-page" element={<AdminPage />} />
      </Routes>
  );
};
