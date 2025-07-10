import { useState, useEffect } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const useGenres = () => {
  const [genres, setGenres] = useState<any[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const genresCollection = collection(db, "genres");
      const snapshot = await getDocs(genresCollection);
      const genresList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGenres(genresList);
    };

    fetchGenres();
  }, []);

  return genres;
};

export default useGenres;
