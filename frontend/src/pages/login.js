import React, { useState } from 'react';
import axios from 'axios';
import Header2 from '../components/header2'; 
import Footer from '../components/footer';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUpClick = () => {
    navigate("/auth/signup"); // Assuming "/signup" is the path for the SignUp page
  };

  return (
    <div >
      <Header2 />
        <div className="auth-container">
          
        
            <form className="login-form" onSubmit={handleSubmit}>
              <h2>Login</h2>

              <div className="fg">
                <label htmlFor="username"> Username: </label>
                <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
              </div>

              <div className="fg">
                <label htmlFor="password"> Password: </label>
                <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>

                <button type="submit" className="login-button">Login</button>

              <p> <span className="signup-link" onClick={handleSignUpClick}></span></p>
            </form>
        </div>
      <Footer />
    </div>
  );
};

export default Login;
