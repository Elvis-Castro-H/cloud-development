import useGenres from "../hooks/useGenres";
import "../styles/HomePage.css";

const HomePage = () => {
  const genres = useGenres();

  return (
    <div className="home-page-container">
      <h1 className="home-page-title">Géneros</h1>
      <div className="genres-container">
        {genres.map((genre) => (
          <div key={genre.id} className="card-container">
            <img src={genre.image} alt={genre.name} className="card-image" />
            <div className="card-title">{genre.name}</div>
            <a href={`/genre/${genre.id}`} className="card-link">Ver artistas</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
