import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import './PositionsView.css';


function  PositionsView(props) {
  
  return(
    <div>
      <NavBar user={props.user} setUser={props.setUser}/>
      <div className="SA-positions-view">
      <div className="SA-positions-link-container">
        <div className="SA-positions-link-container-left">
          <Link to={"/addassetform/"}>
            <button className='SA-link-button'>Add Asset</button>
          </Link>
        </div>
        <div className="SA-positions-link-container-right">
          <Link to={"/sector/"}>
            <p className="SA-positions-return-link">Return to Sector</p>
          </Link>
          <Link to={"/"}>
            <p className="SA-positions-return-link">Return to Portfolios</p>
          </Link>
        </div>
      </div>
      <div className="SA-positions-info">
        <h1>{props.selectedSector.charAt(0).toUpperCase() + props.selectedSector.slice(1)}</h1>
        <h2><span
              className={props.updatedTotalValue > props.totalAssetValue ? 'postive' : 'negative'}
            >
            ${props.updatedTotalValue.toFixed(2)}
            </span>
            /${props.totalAssetValue.toFixed(2)}
            <span
            className={props.updatedTotalValue - props.totalAssetValue >= 0 ? 'positive' : 'negative'}
            >
              ({(props.updatedTotalValue - props.totalAssetValue) >= 0
                ? `+$${(props.updatedTotalValue - props.totalAssetValue).toFixed(2)}`
                : `-$${Math.abs((props.updatedTotalValue - props.totalAssetValue).toFixed(2))}`})
            </span>
        </h2>
      </div>
        <table className="SA-portfolio-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Initial Investment</th>
              <th>MKT Value</th>
              <th>% Change</th>
              <th>Initial Portfolio %</th>
              <th>Current Portfolio %</th>
              <th>Adjust Investment</th>
            </tr>
          </thead>
          <tbody>
            {props.assetsInSector.map((item, index) => (
            <tr key={index}>
              <td>{item.label}</td>
              <td>${(item.value).toFixed(2)}</td>
              <td><span 
                      className={props.currentValues[item.label] > item.value ? 'positive' : 'negative'}
                    >
                    ${(props.currentValues[item.label] || 0).toFixed(2)}
                  </span>
              </td>
              <td><span
                    className={((props.currentValues[item.label] - item.value)/item.value) * 100 > 0 ? 'positive' : 'negative'}
                  >
                  {(((props.currentValues[item.label] - item.value)/item.value) * 100).toFixed(2)}%
                  </span>
              </td>
              <td>{(item.value/props.totalAssetValue * 100).toFixed(2)}%</td>
              <td>{((props.currentValues[item.label]/props.updatedTotalValue)*100).toFixed(2)}%</td>
              <td>
                <div className="SA-table-buttons">
                  <Link to={"/editassetform/"}>
                    <button className="SA-delete-button" onClick={() => props.handleEditAsset(item)}>Edit</button>
                  </Link>
                    <button  className="SA-delete-button"onClick={() => props.handleAssetDelete(item)}>X</button>
                </div>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
        
        {props.smartAdjust === true ?
          <div>
            <div className="SA-smart-adjust">
              <div className="SA-smart-adjust-info">
                <h2>Smart Adjusted Portfolio</h2>
                <h4>Current Portfolio Value: ${props.updatedTotalValue.toFixed(2)}</h4>
                <p>*Based on your initial portfolio percentages this is how to adjust your portfolio to return to those percentages</p>
              </div>
            <table className="SA-smart-adjust-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Target %</th>
                  <th>Adjusted Value</th>
                  <th>Adjustment Help</th>
                </tr>
              </thead>
              <tbody>
              {props.assetsInSector.map((item, index) => (
                <tr key={index}>
                  <td>{item.label}</td>
                  <td>{(item.value/props.totalAssetValue*100).toFixed(2)}%</td>
                  <td>${(props.updatedTotalValue*(item.value/props.totalAssetValue)).toFixed(2)}</td>
                  <td>
                  {
                  props.currentValues[item.label] < (props.updatedTotalValue*(item.value/props.totalAssetValue)) ? `Increase investment by $${((props.updatedTotalValue*(item.value/props.totalAssetValue)) - props.currentValues[item.label]).toFixed(2)}.` : 
                  props.currentValues[item.label] > (props.updatedTotalValue*(item.value/props.totalAssetValue)) ? `Decrease investment by $${(props.currentValues[item.label] - (props.updatedTotalValue*(item.value/props.totalAssetValue))).toFixed(2)}.`  :
                  "Investment value remains the same."
                  }
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <button className="SA-smart-adjust-button" onClick={()=> props.setSmartAdjust(false)}>SmartAdjust</button>
          </div>
          :
          <button className="SA-smart-adjust-button" onClick={()=> props.setSmartAdjust(true)}>SmartAdjust</button> 
        }
      </div>
    </div>
  );
}

export default PositionsView;

