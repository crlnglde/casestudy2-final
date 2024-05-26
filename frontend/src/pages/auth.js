import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/header'; 
import Footer from '../components/footer';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="auth">
      <Header />
      <Login />
      <Signup />
      <Footer />
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });

      setCookies("access_token", response.data.token);
      window.localStorage.setItem("customerID", response.data.customerID);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username"> Username: </label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password"> Password: </label>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>

        <button type="submit"> Login </button>
      </form>
    </div>
  );
};

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3000/auth/signup", {
        firstName,
        lastName,
        username,
        password,
      });
      alert("Registration Completed! ");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>SignUp</h2>
        <div className="form-group">
          <label htmlFor="firstName"> First Name: </label>
          <input type="text" id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="lastName"> Last Name: </label>
          <input type="text" id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="username"> Username: </label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password"> Password: </label>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>

        <button type="submit"> SignUp </button>
      </form>
    </div>
  );
};

export default Auth;
