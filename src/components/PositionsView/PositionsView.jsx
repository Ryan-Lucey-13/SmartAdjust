import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PositionsView.css';


function  PositionsView(props) {
  
  return(
    <div>
      <Link to={"/sector/"}>
        <button>Return to Sector</button>
      </Link>
      <h1>{props.selectedSector.charAt(0).toUpperCase() + props.selectedSector.slice(1)}</h1>
      <h2>${props.updatedTotalValue.toFixed(2)}/${props.totalAssetValue.toFixed(2)}</h2>
      <table>
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
            <td>${item.value}</td>
            <td>${(props.currentValues[item.label] || 0).toFixed(2)}</td>
            <td>{(((props.currentValues[item.label] - item.value)/item.value) * 100).toFixed(2)}%</td>
            <td>{(item.value/props.totalAssetValue * 100).toFixed(2)}%</td>
            <td>{((props.currentValues[item.label]/props.updatedTotalValue)*100).toFixed(2)}%</td>
            <td>
              <Link to={"/editassetform/"}>
                <button onClick={() => props.handleEditAsset(item)}>Edit</button>
              </Link>
                <button onClick={() => props.handleAssetDelete(item)}>X</button>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
      
      {props.smartAdjust === true ?
        <div>
          <h2>SmartAdjusted Portfolio</h2>
          <h4>Current Portfolio Value: ${props.updatedTotalValue.toFixed(2)}</h4>
          <p>*Based on your initial portfolio percentages this is how to adjust your portfolio to return to those percentages</p>
          <table>
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
                <td>${(item.value/props.totalAssetValue*100).toFixed(2)}%</td>
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
        :
        <button onClick={()=> props.setSmartAdjust(true)}>SmartAdjust</button> 
      }
    </div>
  );
}

export default PositionsView;

