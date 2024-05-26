import React, { useState } from 'react';
import axios from 'axios';
import Header2 from '../components/header2'; 
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import '../css/signup.css'; 

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3000/auth/signup", {
        firstName,
        lastName,
        username,
        password,
        createdAt: new Date() // Add createdAt field with current date
      });
      alert("Registration Completed! ");
      navigate("/auth/login"); // Redirect to the login page after successful registration

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header2 />
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="signup-form"> {/* Add class for styling */}
          <h2>SignUp</h2>
          <div className="fg">
            <label htmlFor="firstName"> First Name: </label>
            <input type="text" id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
          </div>
          <div className="fg">
            <label htmlFor="lastName"> Last Name: </label>
            <input type="text" id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </div>
          <div className="fg">
            <label htmlFor="username"> Username: </label>
            <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          </div>
          <div className="fg">
            <label htmlFor="password"> Password: </label>
            <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>

          <button type="submit"> SignUp </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
