import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import logo from '../../assets/logo.png'; 
import LogoutButton from '../LogoutButton/LogoutButton';
import './NavBar.css';



function  NavBar(props) {

  return(
    <div className="SA-navbar">
      {props.user ? (
      <>
      <Link to={"/"}>
        <img className="SA-navbar-logo" src={logo} alt="Logo" />
      </Link>
      <div className="SA-navbar-right">
      <p className="SA-navbar-user">Welcome, {props.user.username}</p>
      <LogoutButton setUser={props.setUser}
      />
      </div>
      </>
      ) : (
      <img className="SA-navbar-logo" src={logo} alt="Logo" />
      )}
    </div>
  );
}

export default NavBar;

