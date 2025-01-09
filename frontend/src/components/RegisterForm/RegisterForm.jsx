import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './RegisterForm.css';


function  RegisterForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  function getCSRFToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
  };

  function handleRegisterSubmit(ev) {
    ev.preventDefault();
    const data = {
      username: username,
      password: password,
      email: email,
    }
    
    axios.post(
      'http://localhost:8000/register/', 
        data,
        {
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-type': 'application/json'
        },
       withCredentials: true 
      })
    .then(response => {
      setSuccess(response.data.message);
      setError('');
      navigate('/login/');
    })
    .catch(err => {
      setError('Error: ' + err.response.data.error);
      setSuccess('');
    })
  }

  return(
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleRegisterSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterForm;

