import { useState, useEffect } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const useSongs = (artistId: string) => {
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const songsCollection = collection(db, "songs");
      const q = query(songsCollection, where("artistId", "==", artistId));
      const snapshot = await getDocs(q);
      const songsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSongs(songsList);
    };

    fetchSongs();
  }, [artistId]);

  return songs;
};

export default useSongs;
