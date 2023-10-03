import React, { useState } from "react";
import "../styles/login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [err, setError] = useState(false);
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      history("/");
    } catch (err) {
      setError(true);
    }
  };
  return (
    <div className="fromContainer">
      <div className="formWrapper">
        <span className="title">Welcome Back</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter email..." />

          <input type="password" placeholder="Enter password..." />

          <input type="submit" value="Login" />
        </form>
        {err && <span style={{color:"red"}}>Something went wrong</span>}
        <p>
          Doesn`t have an account?{" "}
          <span>
            <Link to="/register">Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
