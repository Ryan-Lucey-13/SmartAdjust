import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from "../LogoutButton/LogoutButton";
import LoginForm from "../LoginForm/LoginForm"
import './PortfolioList.css';

function  PortfolioList(props) {
  return(
    <div>
      {props.user ? (
      <>
      <Link to={'/login/'}>
        <p>Login</p>
      </Link>
      <Link to={'/register/'}>
        <p>Register</p>
      </Link>
      {props.user ? (
        <>
          <Link to={'/profile/'}>
            <p>Profile</p>
          </Link>
          <LogoutButton setUser={props.setUser}
          />
        </>
      ) : (
        <p>Login</p>
      )}
      <h1 className="SA-title">Portfolios</h1>
      <h2>Total Value: ${props.totalValue}</h2>
      <ul>
        {props.portfolios.map(portfolio => (
          <li className="SA-portfolio" key={portfolio.label}>
            {props.editingPortfolio === portfolio.label ? (
              <div>
                <input 
                  type="text"
                  value={props.newPortfolioName}
                  onChange={(ev) => props.setNewPortfolioName(ev.target.value)}
                />
                <button onClick={() => props.handlePortfolioSaveClick(portfolio.label)}>Save</button>
                <button onClick={props.handlePortfolioCancelClick}>Cancel</button>
              </div>
              ) : (
            <div>
              <Link to={'/portfolio/'}>
                <h2 className="SA-portfolio-label" onClick={() => props.selectPortfolio(portfolio.label)}>
                  {portfolio.label.charAt(0).toUpperCase() + portfolio.label.slice(1) + " : $" + props.portfolioTotals[props.portfolios.indexOf(portfolio)]}
                </h2>
              </Link>
              <button onClick={() => props.handlePortfolioEditClick(portfolio)}>Edit</button>
              <button onClick={() => props.deletePortfolio(portfolio.label)}>Delete</button>
            </div>
            )}
            {portfolio.sectors.map(sector => (
              <div key={sector.label}>
              {props.editingSector === sector.label ? (
                <div>
                  <input 
                  type="text"
                  value={props.newSectorName}
                  onChange={(ev) => props.setNewSectorName(ev.target.value)}
                  />
                  <button onClick={() => props.handleSectorSaveClick(portfolio.label)}>Save</button>
                  <button onClick={props.handleSectorCancelClick}>Cancel</button>
                </div>
              ) : (
                <div>
                  <Link to={'/sector/'}>
                    <h3 className="SA-portfolio-sector" onClick={() => props.selectSector(sector.label)}>
                      - {sector.label.charAt(0).toUpperCase() + sector.label.slice(1)}
                      {props.sectorTotals[sector.label] !== undefined && ` : $${props.sectorTotals[sector.label]}`}

                    </h3>
                  </Link>
                  <button onClick={() => props.handleSectorEditClick(sector)}>Edit</button>
                  <button onClick={() => props.deleteSector(portfolio.label, sector.label)}>Delete</button>
                </div>
              )}
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
      </>
      ) : (
        <LoginForm setUser={props.setUser} />
      )}
    </div>
  );
}

export default PortfolioList;