import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import LoginForm from "../LoginForm/LoginForm"
import './AddAssetForm.css';


function  AddAssetForm(props) {
  const [dateError, setDateError] = useState(null);
  const [sectorError, setSectorError] = useState(null);
  const [portfolioError, setPortfolioError] = useState(null);

  function isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 5 || day === 6; 
  };

  function validateDate(date) {
    if (isWeekend(date)) {
      setDateError('Stock market is closed on weekends. Please select a weekday.');
      return false;
    }
    setDateError(null); 
    return true;
  };

  function validatePortfolioAndSector() {
    if (!props.selectedPortfolio) {
      setPortfolioError('Please select a portfolio.');
      return false;
    }
    setPortfolioError(null);

    const selectedPortfolioObj = props.portfolios.find(p => p.label === props.selectedPortfolio);
    if (!selectedPortfolioObj || !selectedPortfolioObj.sectors.some(s => s.label === props.selectedSector)) {
      setSectorError('Please select a valid sector for this portfolio.');
      return false;
    }
    setSectorError(null);
    return true;
  };

  function handleSubmit() {
    if (validatePortfolioAndSector() && validateDate(props.assetDate)) {
      props.handleAddAsset();
    }
  };

  useEffect(() => {
    validatePortfolioAndSector();
  }, [props.selectedPortfolio, props.selectedSector]);

  return(
    <div>
      <NavBar user={props.user} setUser={props.setUser}/>
      <div className="SA-asset-container">
        <div className="SA-asset-form-container">
          <h2 className="SA-asset-title">Create Asset</h2>
          <label className="SA-asset-input">
            Portfolio:
            <select value={props.selectedPortfolio} onChange={(ev) => props.setSelectedPortfolio(ev.target.value)}>
              <option value="">Select Portfolio</option>
              {props.portfolios.map((portfolio, index) => (
                <option key={index} value={portfolio.label}>{portfolio.label}</option>
              ))}
            </select>
            {portfolioError && <span className="error-message">{portfolioError}</span>}
          </label>
          <label className="SA-asset-input">
            Sector:
            <select value={props.selectedSector} onChange={(ev) => props.setSelectedSector(ev.target.value)}>
              <option value="">Select Sector</option>
              {props.selectedPortfolio &&
                props.portfolios.find(p => p.label === props.selectedPortfolio)?.sectors.map((sector, index) => (
                <option key={index} value={sector.label}>{sector.label}</option>
              ))}
            </select>
            {sectorError && <span className="error-message">{sectorError}</span>}
          </label>
          <label className="SA-asset-input">
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
          <label className="SA-asset-input">
            Asset Value:
            <input type="number" value={props.assetValue} onChange={(ev) => props.setAssetValue(ev.target.value)} />
          </label>
          <label className="SA-asset-input">
            Asset Date:
            <input 
              type="date" 
              value={props.assetDate} 
              onChange={(ev) => {
                const selectedDate = ev.target.value;
                props.setAssetDate(ev.target.value)
                validateDate(selectedDate);
              }} 
            />
            {dateError && <span className="error-message">{dateError}</span>}
          </label>
          <div className="SA-asset-button-container">
            <Link to={"/"}>
              <button 
                className="SA-asset-button" 
                onClick={handleSubmit}
                disabled={portfolioError || sectorError || dateError}
              >Add Asset</button>
            </Link>
            <Link to={"/"}>
              <button className="SA-asset-button" onClick={props.handleCancelAddAsset}>Cancel</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAssetForm;

