import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './UserProfile.css';


function  UserProfile(props) {

  useEffect (() => {
    axios.get('http://localhost:8000/api/users/current-user', {withCredentials: true})
      .then(response => {
        setUser(response.data)
      })
  }, []);

  return(
    <div>
      <h2>Welcome, {props.user.username}</h2>
      <p>Email: {props.user.email}</p>
    </div>
  );
}

export default UserProfile;

