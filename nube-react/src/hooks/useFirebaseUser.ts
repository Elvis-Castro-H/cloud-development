import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  FacebookAuthProvider,
  GoogleAuthProvider,
  type User,
  signOut,
  linkWithCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";

export const useFirebaseUser = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (user) {
      return;
    }
    onAuthStateChanged(firebaseAuth, (loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    });
  }, [user]);
  const loginWithFirebase = (email: string, password: string) => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed in:", user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
      });
  };

  const registerWithFirebase = async (
    email: string,
    password: string,
    fullName: string,
    address: string,
    birthdate: string,
    age: number
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
  
      console.log("User signed in:", user);
  
      await updateProfile(user, {
        displayName: fullName,
      });
  
      console.log("Profile updated successfully");
  
      await setDoc(doc(db, "users", user.uid), {
        fullname: fullName,
        email: email,
        address: address,
        birthdate: birthdate,
        age: age,
        createdAt: new Date().toISOString(),
      });
  
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("Este correo electrónico ya está en uso. Intenta con otro.");
      } else {
        console.error("Error during registration:", error);
      }
    }
  };  

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        GoogleAuthProvider.credentialFromResult(result);

        console.log("User signed in with Google:", result.user);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Error signing in with Google:", {
          errorCode,
          errorMessage,
          email,
          credential,
        });
      });
  };
  const logout = () => {
    signOut(firebaseAuth)
      .then(() => {
        console.log("User signed out successfully");
        setUser(null);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  const linkWithPassword = (email: string, password: string) => {
    if (!user) {
      return;
    }
    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(user, credential)
      .then((usercred) => {
        const user = usercred.user;
        console.log("Account linking success", user);
      })
      .catch((error) => {
        console.log("Account linking error", error);
      });
  };

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      console.log("User signed in with Facebook:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Facebook:", error);
    }
  };

  return {
    user,
    loginWithFirebase,
    registerWithFirebase,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    linkWithPassword,
  };
};