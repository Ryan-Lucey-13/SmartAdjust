import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './PortfolioView.css';


function  PortfolioView(props) {

  const totalValue = props.portfolios
    .filter(portfolio => portfolio.label === props.selectedPortfolio) // Only include the selected portfolio
    .reduce((total, portfolio) => {
      // Sum the sector totals of the selected portfolio
      const portfolioTotal = portfolio.sectors.reduce((sectorTotal, sector) => {
        return sectorTotal + (props.sectorTotals[sector.label] || 0);
      }, 0);
      return total + portfolioTotal; // Accumulate the total for all sectors in the selected portfolio
  }, 0);

  return(
    <div>
      <Link to={"/"}>
        <button onClick={() => props.setChoosePortfolio(false)}>Return to Portfolios</button>
      </Link>
      <h1>{props.selectedPortfolio.charAt(0).toUpperCase() + props.selectedPortfolio.slice(1)}</h1>
      <h2>${props.updatedTotalValue.toFixed(2)}/${totalValue.toFixed(2)}</h2>
      <table>
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
                <td>${(props.sectorMarketValues[sector.label] || 0).toFixed(2)}</td>
                <td>{((((props.sectorMarketValues[sector.label] - props.sectorTotals[sector.label])/props.sectorTotals[sector.label])*100)).toFixed(2)}%</td>
                <td>{((props.sectorTotals[sector.label]/totalValue)*100).toFixed(2)}%</td>
                <td>{((props.sectorMarketValues[sector.label]/props.updatedTotalValue)*100).toFixed(2)}%</td>
                <td>
                  <button onClick={() => props.deleteSector(portfolio.label, sector.label)}>X</button>
                </td>
              </tr>
            ))
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
        :
        <button onClick={()=> props.setSmartAdjust(true)}>SmartAdjust</button> 
      }
    </div>
  );
}

export default PortfolioView;

