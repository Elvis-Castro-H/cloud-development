import { useState } from "react";
import { useFirebaseUser } from "../hooks/useFirebaseUser";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const { loginWithFirebase, loginWithGoogle, loginWithFacebook } = useFirebaseUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    loginWithFirebase(email, password);
  };

  return (
    <div className="login-page-container">
      <h1 className="login-page-title">Login</h1>

      {/* Login con Email y Contraseña */}
      <div className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      </div>

      <hr className="hr-line" />

      {/* Login con Google */}
      <button onClick={loginWithGoogle} className="social-login-button">
        Login with Google
      </button>

      <hr className="hr-line" />

      {/* Login con Facebook */}
      <button onClick={loginWithFacebook} className="social-login-button">
        Login with Facebook
      </button>

      <hr className="hr-line" />
    </div>
  );
};

export default LoginPage;
