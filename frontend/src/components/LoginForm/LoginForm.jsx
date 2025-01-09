import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './LoginForm.css';


function  LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  function getCSRFToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
  };

  function handleLoginSubmit(ev) {
    ev.preventDefault();
    const data = {
      username: username,
      password: password
    }
    
    axios.post(
      'http://localhost:8000/api/login/', 
        data,
        {
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
        },
       withCredentials: true 
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
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;

