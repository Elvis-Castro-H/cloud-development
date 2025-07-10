import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useArtists from "../hooks/useArtists";
import ArtistCard from "../components/ArtistCard";
import { logEvent } from "firebase/analytics";
import { firebaseAnalytics } from "../firebase/FirebaseConfig"; 
import "../styles/GenrePage.css";

const GenrePage = () => {
  const { genreId } = useParams();
  const artists = useArtists(genreId || "");

  useEffect(() => {
    if (genreId) {      
      logEvent(firebaseAnalytics, "view_genre_page", {
        genreId: genreId,
      });
    }
  }, [genreId]);

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
