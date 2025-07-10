import { useState, useEffect } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useFirebaseUser } from "../hooks/useFirebaseUser";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";  
import { uploadMusicToCloudinary } from "../utils/uploadMusicToCloudinary";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const { user } = useFirebaseUser();
  const [genres, setGenres] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newSong, setNewSong] = useState({ title: "", audioUrl: "", artistId: "" });
  const [newGenreImage, setNewGenreImage] = useState<File | null>(null);
  const [newArtistImage, setNewArtistImage] = useState<File | null>(null);
  const [newSongAudio, setNewSongAudio] = useState<File | null>(null);

  const isAdmin = user?.email === "castro.huanca.elvis@gmail.com"; 

  const fetchData = async () => {
    if (!isAdmin) return;

    const genresCollection = collection(db, "genres");
    const genresSnapshot = await getDocs(genresCollection);
    const genresList = genresSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setGenres(genresList);

    const artistsCollection = collection(db, "artists");
    const artistsSnapshot = await getDocs(artistsCollection);
    const artistsList = artistsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setArtists(artistsList);

    const songsCollection = collection(db, "songs");
    const songsSnapshot = await getDocs(songsCollection);
    const songsList = songsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSongs(songsList);
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleAddGenre = async () => {
    if (!newGenre || !newGenreImage) return;
    const imageUrl = await uploadImageToCloudinary(newGenreImage);
    await addDoc(collection(db, "genres"), { name: newGenre, image: imageUrl });
    setNewGenre("");
    setNewGenreImage(null);
    fetchData();
  };

  const handleAddArtist = async () => {
    if (!newArtist || !newArtistImage || !newSong.artistId) return;
    const imageUrl = await uploadImageToCloudinary(newArtistImage);
    await addDoc(collection(db, "artists"), { name: newArtist, image: imageUrl, genreId: newSong.artistId });
    setNewArtist("");
    setNewArtistImage(null);
    fetchData();
  };

  const handleAddSong = async () => {
    if (!newSong.title || !newSongAudio || !newSong.artistId) return;
    const audioUrl = await uploadMusicToCloudinary(newSongAudio);
    await addDoc(collection(db, "songs"), { title: newSong.title, audioUrl, artistId: newSong.artistId });
    setNewSong({ title: "", audioUrl: "", artistId: "" });
    setNewSongAudio(null);
    fetchData();
  };

  const handleDeleteGenre = async (id: string) => {
    await deleteDoc(doc(db, "genres", id));
    fetchData();
  };

  const handleDeleteArtist = async (id: string) => {
    await deleteDoc(doc(db, "artists", id));
    fetchData();
  };

  const handleDeleteSong = async (id: string) => {
    await deleteDoc(doc(db, "songs", id));
    fetchData();
  };

  if (!isAdmin) {
    return <div className="error-message">No tienes acceso a esta página.</div>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Panel de Administración</h1>

      <div className="admin-form">
        <h2>Añadir Género</h2>
        <input
          className="admin-input"
          type="text"
          placeholder="Nombre del género"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
        />
        <input
          className="admin-file-input"
          type="file"
          accept="image/*"
          onChange={(e) => setNewGenreImage(e.target.files ? e.target.files[0] : null)}
        />
        <button className="admin-button" onClick={handleAddGenre}>Añadir Género</button>
      </div>

      <div className="admin-form">
        <h2>Añadir Artista</h2>
        <select
          className="admin-input"
          onChange={(e) => setNewSong({ ...newSong, artistId: e.target.value })}
        >
          <option value="">Selecciona un Género</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <input
          className="admin-input"
          type="text"
          placeholder="Nombre del artista"
          value={newArtist}
          onChange={(e) => setNewArtist(e.target.value)}
        />
        <input
          className="admin-file-input"
          type="file"
          accept="image/*"
          onChange={(e) => setNewArtistImage(e.target.files ? e.target.files[0] : null)}
        />
        <button className="admin-button" onClick={handleAddArtist}>Añadir Artista</button>
      </div>

      <div className="admin-form">
        <h2>Añadir Canción</h2>
        <select
          className="admin-input"
          onChange={(e) => setNewSong({ ...newSong, artistId: e.target.value })}
        >
          <option value="">Selecciona un Artista</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>{artist.name}</option>
          ))}
        </select>
        <input
          className="admin-input"
          type="text"
          placeholder="Título de la canción"
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
        />
        <input
          className="admin-file-input"
          type="file"
          accept="audio/*"
          onChange={(e) => setNewSongAudio(e.target.files ? e.target.files[0] : null)}
        />
        <button className="admin-button" onClick={handleAddSong}>Añadir Canción</button>
      </div>

      <h2>Géneros</h2>
      <ul className="admin-list">
        {genres.map((genre) => (
          <li key={genre.id}>
            {genre.name}{" "}
            <button className="delete-button" onClick={() => handleDeleteGenre(genre.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h2>Artistas</h2>
      <ul className="admin-list">
        {artists.map((artist) => (
          <li key={artist.id}>
            {artist.name}{" "}
            <button className="delete-button" onClick={() => handleDeleteArtist(artist.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h2>Canciones</h2>
      <ul className="admin-list">
        {songs.map((song) => (
          <li key={song.id}>
            {song.title}{" "}
            <button className="delete-button" onClick={() => handleDeleteSong(song.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
