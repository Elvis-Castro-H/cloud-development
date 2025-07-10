
import { Link } from "react-router-dom";

const Card = ({ genre }: any) => {
  return (
    <div className="card">
      <img src={genre.image} alt={genre.name} />
      <h3>{genre.name}</h3>
      <Link to={`/genre/${genre.id}`}>Ver artistas</Link>
    </div>
  );
};

export default Card;
