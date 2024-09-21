import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './AddAssetForm.css';


function  AddAssetForm(props) {
    const [assetLabel, setAssetLabel] = useState('');
    const [assetValue, setAssetValue] = useState('');

    function handleAddAsset() {
      if (props.selectedPortfolio && props.selectedSector && assetLabel && assetValue) {
        props.addAsset(props.selectedPortfolio, props.selectedSector, { label: assetLabel, value: parseFloat(assetValue) });
        setAssetLabel('');
        setAssetValue('');
      }
    }

  return(
    <div>
      <h2>Add Asset</h2>
      <label>
        Portfolio:
        <select value={props.selectedPortfolio} onChange={(ev) => props.setSelectedPortfolio(ev.target.value)}>
          <option value="">Select Portfolio</option>
          {props.portfolios.map((portfolio, index) => (
            <option key={index} value={portfolio.label}>{portfolio.label}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Sector:
        <select value={props.selectedSector} onChange={(ev) => props.setSelectedSector(ev.target.value)}>
          <option value="">Select Sector</option>
          {props.selectedPortfolio &&
            props.portfolios.find(p => p.label === props.selectedPortfolio)?.assets.map((sector, index) => (
            <option key={index} value={sector.label}>{sector.label}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Asset Label:
        <input type="text" value={assetLabel} onChange={(ev) => setAssetLabel(ev.target.value)} />
      </label>
      <br />
      <label>
        Asset Value:
        <input type="number" value={assetValue} onChange={(ev) => setAssetValue(ev.target.value)} />
      </label>
      <br />
      <Link to={"/"}>
        <button onClick={handleAddAsset}>Add Asset</button>
      </Link>
    </div>
  );
}

export default AddAssetForm;

