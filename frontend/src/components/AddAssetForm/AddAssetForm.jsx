import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './AddAssetForm.css';


function  AddAssetForm(props) {
    
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
            props.portfolios.find(p => p.label === props.selectedPortfolio)?.sectors.map((sector, index) => (
            <option key={index} value={sector.label}>{sector.label}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Asset Label:
        <input type="text" value={props.inputValue} onChange={props.handleInputChange} />
          {props.stockSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
                {props.stockSuggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => props.handleSuggestionClick(suggestion)}
                        className="autocomplete-suggestion"
                    >
                        <strong>{suggestion.symbol}</strong> - {suggestion.name}
                    </li>
                ))}
            </ul>
          )}
      </label>
      <br />
      <label>
        Asset Value:
        <input type="number" value={props.assetValue} onChange={(ev) => props.setAssetValue(ev.target.value)} />
      </label>
      <br />
      <label>
        Asset Date:
        <input type="date" value={props.assetDate} onChange={(ev) => props.setAssetDate(ev.target.value)} />
      </label>
      <br />
      <Link to={"/"}>
        <button onClick={props.handleAddAsset}>Add Asset</button>
      </Link>
    </div>
  );
}

export default AddAssetForm;

