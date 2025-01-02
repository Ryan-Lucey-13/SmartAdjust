import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './EditAssetForm.css';


function  EditAssetForm(props) {
  
  return(
    <div>
      <h2>Edit Asset: {props.editedAsset.label}</h2>
      <label>
        Asset Value:
        <input type="number" value={props.newValue || ''} placeholder = {props.editedAsset.value || 'Enter Value'} onChange={(ev) => props.setNewValue(ev.target.value)} />
      </label>
      <br />
      <label>
        Asset Date:
        <input type="date" value={props.newDate || ''} onChange={(ev) => props.setNewDate(ev.target.value)} />
      </label>
      <Link to={"/"}>
        <button onClick={props.handleAssetEditSave}>Save Edit</button>
      </Link>
      <Link to={"/"}>
        <button onClick={props.handleAssetCancelClick}>Cancel</button>
      </Link>
    </div>
  );
}

export default EditAssetForm;

