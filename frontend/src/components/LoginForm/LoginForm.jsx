import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import NavBar from '../NavBar/NavBar';
import './LoginForm.css';


function  LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  function getCSRFToken() {
    const cookies = document.cookie;
    console.log('Cookies:', cookies);

    const match = cookies.match(/csrftoken=([^;]+)/);
    if (match) {
      console.log('CSRF token found:', match[1]);
      return match[1];
    } else {
      console.log('CSRF token not found');
      return null;
    }
  }
  const apiUrl = 'https://smart-adjust-backend-946401044616.herokuapp.com'
  function handleLoginSubmit(ev) {
    ev.preventDefault();
    const data = {
      username: username,
      password: password
    }
    
    axios.post(
      `${apiUrl}/api/login/`, 
        data,
        {
          headers: {
            'Content-Type': 'application/json',
        },
       withCredentials: true,
       withXSRFToken: true,
      })
    .then(response => {
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token)
        }
        props.setUser(response.data.user)
        setError('');
        navigate('/');
      } else {
          setError('Invalid credentials. Please try again.');
      }
    })
    .catch(err => {
      setError('Invalid credentials. Please try again.');
    })
  }

  return(
    <div>
      <NavBar user={props.user} setUser={props.setUser}/>
      <div className="SA-login-container">
        <div className="SA-login-form-container">
        <h2 className="SA-login-title">Login</h2>
        <Link to={'/register/'}>
          <p className="SA-register">Create an account</p>
        </Link>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLoginSubmit}>
          <input
            className="SA-login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            required
          />
          <input
            className="SA-login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
          <button className="SA-login-submit" type="submit">Login</button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

