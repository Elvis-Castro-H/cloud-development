import { useParams } from "react-router-dom";
import useArtists from "../hooks/useArtists";
import ArtistCard from "../components/ArtistCard";
import "../styles/GenrePage.css";

const GenrePage = () => {
  const { genreId } = useParams();
  const artists = useArtists(genreId || "");

  return (
    <div className="genre-page-container">
      <h1 className="genre-page-title">Artistas</h1>
      <div className="artists-container">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default GenrePage;
