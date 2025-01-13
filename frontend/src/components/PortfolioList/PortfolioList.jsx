import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from "../LogoutButton/LogoutButton";
import LoginForm from "../LoginForm/LoginForm"
import NavBar from '../NavBar/NavBar';
import './PortfolioList.css';

function  PortfolioList(props) {
  return(
    <div className="SA-portfolio-list">
    <NavBar user={props.user} setUser={props.setUser}/>
      <h1 className="SA-title">Portfolios</h1>
      <div className="SA-header">
      <div className="SA-header-buttons">
      {!props.newPortfolio ? (
        <button className="SA-new-portfolio-button" onClick={props.handleNewPortfolioClick}>Add Portfolio</button>
      ) : (
        <div className="SA-new-portfolio">
          <input
            className="SA-input"
            placeholder="Enter New Portfolio Name..."
            onChange={props.handleNewInput}
            value={props.input}
          />
          <button className="SA-buttons SA-create-buttons" onClick={props.addNewPortfolioInput}>Add Portfolio</button>
          <button className="SA-buttons SA-create-buttons" onClick={props.cancelNewPortfolioInput}>x</button>
        </div>
      )}
      <Link to={"/addassetform/"}>
        <button className="SA-new-asset-button">Add Asset</button>
      </Link>
      </div>
      <h2 className="SA-totalvalue">Total Value: ${(props.totalValue || 0).toFixed(2) }</h2>
      </div>
      <ul className="SA-portfolio-container">
        {props.portfolios.map(portfolio => (
          <li className="SA-portfolio" key={portfolio.label}>
            {props.editingPortfolio === portfolio.label ? (
              <div>
                <input
                  className="SA-input"
                  type="text"
                  value={props.newPortfolioName}
                  onChange={(ev) => props.setNewPortfolioName(ev.target.value)}
                />
                <button className="SA-create-buttons" onClick={() => props.handlePortfolioSaveClick(portfolio.label)}>Save</button>
                <button className="SA-create-buttons" onClick={props.handlePortfolioCancelClick}>Cancel</button>
              </div>
              ) : (
            <div className="SA-portfolio-label">
              <Link to={'/portfolio/'}>
                <h2 className="SA-portfolio-name" onClick={() => props.selectPortfolio(portfolio.label)}>
                  {portfolio.label.charAt(0).toUpperCase() + portfolio.label.slice(1) + " : $" + (props.portfolioTotals[props.portfolios.indexOf(portfolio)] || 0).toFixed(2)}
                </h2>
              </Link>
              <div className="SA-buttons-container">
                <button className="SA-buttons SA-portfolio-buttons" onClick={() => props.handlePortfolioEditClick(portfolio)}>✏️</button>
                <button className="SA-buttons SA-portfolio-buttons" onClick={() => props.deletePortfolio(portfolio.label)}>✖️</button>
              </div>
            </div>
            )}
            {portfolio.sectors.map(sector => (
              <div key={sector.label}>
              {props.editingSector === sector.label ? (
                <div>
                  <input
                  className="SA-input"
                  type="text"
                  value={props.newSectorName}
                  onChange={(ev) => props.setNewSectorName(ev.target.value)}
                  />
                  <button className="SA-buttons SA-create-buttons" onClick={() => props.handleSectorSaveClick(portfolio.label)}>Save</button>
                  <button className="SA-buttons SA-create-buttons" onClick={props.handleSectorCancelClick}>Cancel</button>
                </div>
              ) : (
                <div className="SA-portfolio-sector">
                  <Link to={'/sector/'}>
                    <h3  className="SA-sector-label" onClick={() => props.selectSector(sector.label)}>
                      - {sector.label.charAt(0).toUpperCase() + sector.label.slice(1)}
                      {props.sectorTotals[sector.label] !== undefined && ` : $${(props.sectorTotals[sector.label] || 0).toFixed(2)}`}

                    </h3>
                  </Link>
                  <div className="SA-buttons-container">
                    <button className="SA-buttons SA-sector-buttons" onClick={() => props.handleSectorEditClick(sector)}>✏️</button>
                    <button className="SA-buttons SA-sector-buttons" onClick={() => props.deleteSector(portfolio.label, sector.label)}>✖️</button>
                  </div>
                </div>
              )}
                {props.renderItems(sector.assets || [])}
              </div>
            ))}
            {!props.newSector && (
              <button className= "SA-button SA-new-sector-button" onClick={() => props.handleNewSectorClick(portfolio.label)}>
                Add Sector
              </button>
            )}
            {props.newSector && props.selectedPortfolio === portfolio.label && (
              <div className="SA-new-sector">
                <input
                  className="SA-input"
                  placeholder="Enter New Sector Name..."
                  onChange={props.handleNewInput}
                  value={props.input}
                />
                <button className="SA-buttons SA-create-buttons" onClick={props.addNewSectorInput}>Add Sector</button>
                <button className="SA-buttons SA-create-buttons" onClick={props.cancelNewSectorInput}>x</button>
              </div>
            )}
          </li>
        ))}
      </ul>
        {!props.user && <LoginForm setUser={props.setUser} />}

    </div>
  );
}

export default PortfolioList;