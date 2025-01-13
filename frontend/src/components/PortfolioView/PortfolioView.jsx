import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import NavBar from '../NavBar/NavBar';
import LoginForm from "../LoginForm/LoginForm"
import './PortfolioView.css';


function  PortfolioView(props) {

  const totalValue = props.portfolios
    .filter(portfolio => portfolio.label === props.selectedPortfolio)
    .reduce((total, portfolio) => {
      const portfolioTotal = portfolio.sectors.reduce((sectorTotal, sector) => {
        return sectorTotal + (props.sectorTotals[sector.label] || 0);
      }, 0);
      return total + portfolioTotal; 
  }, 0);

  return(
    <div>
    <NavBar user={props.user} setUser={props.setUser}/>
    <div className="SA-portfolio-view">
      <Link to={"/"}>
        <p className="SA-return-link" onClick={() => props.setChoosePortfolio(false)}>Return to Portfolios</p>
      </Link>
      <div className="SA-portfolio-info">
        <h1 className="SA-portfolio-label-title">{props.selectedPortfolio.charAt(0).toUpperCase() + props.selectedPortfolio.slice(1)}</h1>
        <h2 className="SA-portfolio-totalvalue"><span
              className={props.updatedTotalValue > totalValue ? 'postive' : 'negative'}
            >
              ${props.updatedTotalValue.toFixed(2)}
            </span>
              /${totalValue.toFixed(2)}
          <span
            className={props.updatedTotalValue - totalValue >= 0 ? 'positive' : 'negative'}
          >
            ({(props.updatedTotalValue - totalValue) >= 0
              ? `+${(props.updatedTotalValue - totalValue).toFixed(2)}`
              : (props.updatedTotalValue - totalValue).toFixed(2)})
          </span>
        </h2>
      </div>
      <div className="SA-table-container">
      <table className="SA-portfolio-table">
        <thead>
          <tr>
            <th>Sector</th>
            <th>Initial Investment</th>
            <th>MKT Value</th>
            <th>% Change</th>
            <th>Initial Portfolio %</th>
            <th>Current Portfolio %</th>
            <th>Remove Investment</th>
          </tr>
        </thead>
        <tbody>
          {props.portfolios
            .filter(portfolio => portfolio.label === props.selectedPortfolio)
            .map((portfolio, index) => (
            portfolio.sectors.map((sector, index) => (
              <tr key={index}>
                <td><Link to='/sector/' onClick={() => props.selectSector(sector.label)}>{sector.label.charAt(0).toUpperCase() + sector.label.slice(1)}</Link></td>
                <td>${props.sectorTotals[sector.label].toFixed(2) || 0}</td>
                <td><span 
                      className={props.sectorMarketValues[sector.label] > props.sectorTotals[sector.label] ? 'postive' : 'negative'}
                    >
                    ${(props.sectorMarketValues[sector.label] || 0).toFixed(2)}
                    </span>
                </td>
                <td>
                  <span
                    className={(((props.sectorMarketValues[sector.label] - props.sectorTotals[sector.label])/props.sectorTotals[sector.label])*100) > 0 ? 'positive' : 'negative'}
                  >
                    {((((props.sectorMarketValues[sector.label] - props.sectorTotals[sector.label])/props.sectorTotals[sector.label])*100)).toFixed(2)}%
                  </span>
                </td>
                <td>{((props.sectorTotals[sector.label]/totalValue)*100).toFixed(2)}%</td>
                <td>{((props.sectorMarketValues[sector.label]/props.updatedTotalValue)*100).toFixed(2)}%</td>
                <td>
                  <button className="SA-delete-button" onClick={() => props.deleteSector(portfolio.label, sector.label)}>X</button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
      </div>
      {props.smartAdjust === true ?
        <div className="SA-smart-adjust">
          <div className="SA-smart-adjust-info">
            <h2 className="SA-portfolio-label-title">Smart Adjusted Portfolio</h2>
            <h4>Current Portfolio Value: ${props.updatedTotalValue.toFixed(2)}</h4>
            <p>*Based on your initial portfolio percentages this is how to adjust your portfolio to return to those percentages.</p>
          </div>
          <div className="SA-table-container">
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
            {props.portfolios
              .filter(portfolio => portfolio.label === props.selectedPortfolio)
              .map((portfolio, index) => (
              portfolio.sectors.map((sector, index) => (
                <tr key={index}>
                  <td><Link to='/sector/' onClick={() => props.selectSector(sector.label)}>{sector.label.charAt(0).toUpperCase() + sector.label.slice(1)}</Link></td>
                  <td>{((props.sectorTotals[sector.label]/totalValue)*100).toFixed(2)}%</td>
                  <td>${(props.updatedTotalValue*(props.sectorTotals[sector.label]/totalValue)).toFixed(2)}</td>
                  <td>
                  {
                  props.sectorMarketValues[sector.label] < (props.updatedTotalValue*(props.sectorTotals[sector.label]/totalValue)) ? `Increase investment by $${((props.updatedTotalValue*(props.sectorTotals[sector.label]/totalValue)) - props.sectorMarketValues[sector.label]).toFixed(2)}.` : 
                  props.sectorMarketValues[sector.label] > (props.updatedTotalValue*(props.sectorTotals[sector.label]/totalValue)) ? `Decrease investment by $${(props.sectorMarketValues[sector.label] - (props.updatedTotalValue*(props.sectorTotals[sector.label]/totalValue))).toFixed(2)}.`  :
                  "Investment value remains the same."
                  }
                  </td>
                </tr>
              ))
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

export default PortfolioView;

