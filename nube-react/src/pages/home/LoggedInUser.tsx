import Button from "../../components/Button";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router";

export const LoggedInUser = () => {
  const navigate = useNavigate();
  const { user, logout } = useFirebaseUser();
  const [userHasGoogle, setUserHasGoogle] = useState(false);
  const [userHasPassword, setUserHasPassword] = useState(false);

  const [profileData, setProfileData] = useState<{
    address: string;
    birthdate: string;
    age: number;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchProfileData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData(docSnap.data() as any);
      }
    };

    fetchProfileData();

    const hasGoogle = user.providerData.some(
      (profile) => profile.providerId === "google.com"
    );
    setUserHasGoogle(hasGoogle);
    const hasPassword = user.providerData.some(
      (profile) => profile.providerId === "password"
    );
    setUserHasPassword(hasPassword);
    // for (const profile of user.providerData) {
    //   console.log("Provider ID:", profile.providerId);
    // }
  }, [user]);
  const onAddEmailSignInClicked = () => {
    navigate("/linkpassword");
  };
  return (
    <>
      <Card>
        <div>
          <h1>Welcome to the dashboard {user?.displayName}!</h1>
          <div>
            <b>Your email is:</b> {user?.email}
          </div>
          {profileData && (
            <div className="mt-3">
              <h3>Profile Information:</h3>
              <p>
                <b>Address:</b> {profileData.address}
              </p>
              <p>
                <b>Birthdate:</b> {profileData.birthdate}
              </p>
              <p>
                <b>Age:</b> {profileData.age}
              </p>
            </div>
          )}
          <div>
            Add additional login methods:
            {!userHasGoogle && (
              <div>
                <Button variant="danger" className="mt-3" onClick={() => {}}>
                  Add google Sign In
                </Button>
              </div>
            )}
            {!userHasPassword && (
              <div>
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={onAddEmailSignInClicked}
                >
                  Add email Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
        <div>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      </Card>
    </>
  );
};