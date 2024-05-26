import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faHome, faListAlt, faUsers, faInfoCircle, faEnvelope, faUserCircle, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../images/1.png'; 
import '../css/header.css';

const Header = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['access_token']);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookies('access_token');
    window.localStorage.removeItem('customerID');
    window.location.reload(); // Refresh the page
    navigate('/'); // Redirect to the landing page
};

  
  return (
    <header className="fixed-top">
      <nav className="navbar navbar-expand-lg navbar-dark  justify-content-center custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="Laundry App Logo" width="180" height="50" className="d-inline-block align-top" />
          </a>
          <span className="ml-3 text-white"></span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/home   "><FontAwesomeIcon icon={faHome} className="mr-1" />Home</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/bpm/pulse/history"><FontAwesomeIcon icon={faListAlt} className="mr-1" />BPM History</a>
              </li>
                
              <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                Logout
              </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
