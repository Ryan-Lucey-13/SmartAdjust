import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './LogoutButton.css';


function  LogoutButton(props) {
  const navigate = useNavigate();

  function getCSRFToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
  };

  function handleLogout() {
    const csrfToken = getCSRFToken();
    const apiUrl = 'https://smart-adjust-backend-946401044616.herokuapp.com'
    axios.post(
      `${apiUrl}/api/logout/`, 
      {}, 
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
        withXSRFToken: true,
      }
    )
    .then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');

      props.setUser(null);

      navigate('/login/');
    })
    .catch((err) => {
      console.error("Error logging out", err);
    });
  };


  return(
    <button className="SA-logout-button" onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;

