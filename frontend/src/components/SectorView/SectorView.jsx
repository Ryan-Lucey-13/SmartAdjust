import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import NavBar from '../NavBar/NavBar';
import './SectorView.css';


function  SectorView(props) {

  return(
    <div>
    <div className="SA-sector-view-container">
    <NavBar user={props.user} setUser={props.setUser}/>
    <div className="SA-sector-view-header">
      <div className="SA-sector-links-container">
        <div className="SA-sector-links-container-left">
          <Link to={"/positions/"}>
            <button className="SA-link-button">Positions</button>
          </Link>
          <Link to={"/addassetform/"}>
            <button className="SA-link-button">Add Asset</button>
          </Link>
        </div>
        <Link to={"/"}>
          <p className="SA-sector-return-link" onClick={() => props.setChooseSector(false)}>Return to Portfolios</p>
        </Link>
      </div>
      <h1 className="SA-sector-title">{props.selectedSector.charAt(0).toUpperCase() + props.selectedSector.slice(1)}</h1>
      <div className="SA-time-period-buttons">
        <button className={`SA-period-button ${props.timeRange === 3 ? 'active' : ''}`} onClick={() => props.handleTimeRangeChange(3)}>3 Mo</button> 
        <button className={`SA-period-button ${props.timeRange === 6 ? 'active' : ''}`} onClick={() => props.handleTimeRangeChange(6)}>6 Mo</button> 
        <button className={`SA-period-button ${props.timeRange === 12 ? 'active' : ''}`} onClick={() => props.handleTimeRangeChange(12)}>1 Yr</button>
      </div>
      </div>
      <div id="chart-area" className="SA-chart-container">
        <LineChart className="SA-line-chart" data={props.chartData} options={props.options} />
        <PieChart className="SA-pie-chart" data={props.circleChartData} options={props.circleOptions} />
      </div>
      </div>
    </div>
  );
}

export default SectorView;

