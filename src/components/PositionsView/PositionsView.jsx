import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './PositionsView.css';


function  PositionsView(props) {
  return(
    <div>
      <Link to={"/sector/"}>
        <button>Return to Sector</button>
      </Link>
      <h1>{props.selectedSector.charAt(0).toUpperCase() + props.selectedSector.slice(1)}</h1>
      <h2>Portfolio: {props.selectedPortfolio}</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Initial Investment</th>
            <th>MKT Value</th>
            <th>% Change</th>
            <th>Portfolio %</th>
            <th>Adjust Investment</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
}

export default PositionsView;

