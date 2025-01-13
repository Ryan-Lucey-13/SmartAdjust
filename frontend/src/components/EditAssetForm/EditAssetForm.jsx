import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import './EditAssetForm.css';


function  EditAssetForm(props) {
  
  return(
    <div>
      <NavBar user={props.user} setUser={props.setUser}/>
      <div className="SA-edit-asset-container">
        <div className="SA-edit-asset-form-container">
          <h2 className="SA-edit-asset-title">Edit Asset: {props.editedAsset.label}</h2>
          <label className="SA-edit-asset-label">
            Asset Value:
            <input
              className="SA-edit-asset-input"
              type="number" 
              value={props.newValue || ''} 
              placeholder = {props.editedAsset.value || 'Enter Value'} 
              onChange={(ev) => props.setNewValue(ev.target.value)} 
            />
          </label>
          <br />
          <label className="SA-edit-asset-label">
            Asset Date:
            <input 
              className="SA-edit-asset-input"
              type="date" 
              value={props.newDate || ''} 
              onChange={(ev) => props.setNewDate(ev.target.value)} 
            />
          </label>
          <div className="SA-asset-button-container">
            <Link to={"/"}>
              <button className="SA-asset-button" onClick={props.handleAssetEditSave}>Save Edit</button>
            </Link>
            <Link to={"/"}>
              <button className="SA-asset-button" onClick={props.handleAssetCancelClick}>Cancel</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAssetForm;

