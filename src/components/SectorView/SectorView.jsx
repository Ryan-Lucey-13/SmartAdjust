import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './SectorView.css';


function  SectorView(props) {

  return(
    <div>
      <Link to={"/"}>
        <button onClick={() => props.setChooseSector(false)}>Return to Portfolios</button>
      </Link>
      <Link to={"/positions/"}>
        <button>Positions</button>
      </Link>
      <h1>{props.selectedSector.charAt(0).toUpperCase() + props.selectedSector.slice(1)}</h1>
      <button onClick={() => props.handleTimeRangeChange(3)}>3 M</button> <button onClick={() => props.handleTimeRangeChange(6)}>6 M</button> <button onClick={() => props.handleTimeRangeChange(12)}>12 M</button>
      <div id="chart-area">
        <LineChart data={props.chartData} options={props.options} />
        <PieChart data={props.circleChartData} options={props.circleOptions} />
      </div>
      <Link to={"/addassetform/"}>
        <button>Add Asset</button>
      </Link>
    </div>
  );
}

export default SectorView;

