import { useState } from "react";
import { useFirebaseUser } from "../hooks/useFirebaseUser";

const LoginPage = () => {
  const { loginWithFirebase, loginWithGoogle, loginWithFacebook } = useFirebaseUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    loginWithFirebase(email, password);
  };

  return (
    <div>
      <h1>Login</h1>

      {/* Login con Email y Contraseña */}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      <hr />

      {/* Login con Google */}
      <button onClick={loginWithGoogle} style={{ backgroundColor: "blue", color: "white" }}>
        Login with Google
      </button>

      <hr />

      {/* Login con Facebook */}
      <button onClick={loginWithFacebook} style={{ backgroundColor: "blue", color: "white" }}>
        Login with Facebook
      </button>

      <hr />
    </div>
  );
};

export default LoginPage;
