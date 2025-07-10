import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useSongs from "../hooks/useSongs";
import { logEvent } from "firebase/analytics";
import { firebaseAnalytics } from "../firebase/FirebaseConfig";
import "../styles/ArtistPage.css";

const ArtistPage = () => {
  const { artistId } = useParams();
  const songs = useSongs(artistId || "");

  useEffect(() => {
    if (artistId) {
      logEvent(firebaseAnalytics, "view_artist_page", {
        artistId: artistId,
      });
    }
  }, [artistId]);

  return (
    <div className="artist-page-container">
      <h1 className="artist-page-title">Canciones</h1>
      <div className="songs-container">
        {songs.map((song) => (
          <div key={song.id} className="song-card">            
            {song.image && <img src={song.image} alt={song.title} className="song-image" />}
            <h2 className="song-title">{song.title}</h2>
            <audio className="audio-player" controls>
              <source src={song.audioUrl} type="audio/mp3" />
              <p className="audio-player-source">Tu navegador no soporta el reproductor de audio.</p>
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPage;
