import { Link } from "react-router-dom";

const ArtistCard = ({ artist }: any) => {
  return (
    <div className="artist-card">
      <img src={artist.image} alt={artist.name} className="artist-image" />
      <h3 className="artist-name">{artist.name}</h3>
      <Link to={`/artist/${artist.id}`} className="view-artist-link">
        Ver canciones
      </Link>
    </div>
  );
};

export default ArtistCard;
