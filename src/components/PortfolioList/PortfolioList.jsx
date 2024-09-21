import React from 'react';
import { Link } from 'react-router-dom';
import './PortfolioList.css';

function  PortfolioList(props) {
  return(
    <div>
      <h1 className="SA-title">Portfolios</h1>
      <ul>
        {props.portfolios.map(portfolio => (
          <li className="SA-portfolio" key={portfolio.label}>
            <Link to={'/portfolio/'}>
              <h2 className="SA-portfolio-label" onClick={() => props.selectPortfolio(portfolio.label)}>
                {portfolio.label.charAt(0).toUpperCase() + portfolio.label.slice(1) + " : $" + props.totalValue}

              </h2>
            </Link>
            {portfolio.assets.map(sector => (
              <div key={sector.label}>
              <Link to={'/sector/'}>
                <h3 className="SA-portfolio-sector" onClick={() => props.selectSector(sector.label)}>
                  - {sector.label.charAt(0).toUpperCase() + sector.label.slice(1)}
                  {props.sectorTotals[sector.label] !== undefined && ` : $${props.sectorTotals[sector.label]}`}
                </h3>
              </Link>
                {props.renderItems(sector.assets || [])}
              </div>
            ))}
            {!props.newSector && (
              <button className= "SA-button" onClick={() => props.handleNewSectorClick(portfolio.label)}>
                Add Sector
              </button>
            )}
            {props.newSector && props.selectedPortfolio === portfolio.label && (
              <div className="SA-new-sector">
                <input
                  placeholder="Enter New Sector Name..."
                  onChange={props.handleNewInput}
                  value={props.input}
                />
                <button onClick={props.addNewSectorInput}>Add Sector</button>
                <button onClick={props.cancelNewSectorInput}>x</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!props.newPortfolio ? (
        <button className="SA-button" onClick={props.handleNewPortfolioClick}>Add Portfolio</button>
      ) : (
        <div className="SA-new-portfolio">
          <input
            placeholder="Enter New Portfolio Name..."
            onChange={props.handleNewInput}
            value={props.input}
          />
          <button onClick={props.addNewPortfolioInput}>Add Portfolio</button>
          <button onClick={props.cancelNewPortfolioInput}>x</button>
        </div>
      )}
    </div>
  );
}

export default PortfolioList;