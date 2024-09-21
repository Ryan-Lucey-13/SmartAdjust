import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './SectorView.css';


function  SectorView(props) {
  const data = {
        categories: ['Assets'],
        series: [
          {
            name: 'NVDA',
            data: 2000/1000,
          },
          {
            name: 'AMZN',
            data: 2000/1000,
          },
        ],
      };

  const options = {
    chart: { title: 'Portfolio Percentage', width: 600, height: 400 },
  };

  return(
    <div>
      <Link to={"/"}>
        <button onClick={() => props.setChooseSector(false)}>Return to Portfolios</button>
      </Link>
      <Link to={"/positions/"}>
        <button>Positions</button>
      </Link>
      <h1>{props.selectedSector.charAt(0).toUpperCase() + props.selectedSector.slice(1)}</h1>
      <div id="chart-area">
        <LineChart data={props.chartData} options={props.options} />
        <PieChart data={data} options={options} />
      </div>
      <Link to={"/addassetform/"}>
        <button>Add Asset</button>
      </Link>
    </div>
  );
}

export default SectorView;

