import { useState, useEffect } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const useArtists = (genreId: string) => {
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const artistsCollection = collection(db, "artists");
      const q = query(artistsCollection, where("genreId", "==", genreId));
      const snapshot = await getDocs(q);
      const artistsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArtists(artistsList);
    };

    fetchArtists();
  }, [genreId]); 

  return artists;
};

export default useArtists;
