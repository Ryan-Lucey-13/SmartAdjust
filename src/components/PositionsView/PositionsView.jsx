import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './PositionsView.css';


function  PositionsView(props) {
  const [currentValues, setCurrentValues] = useState({});
  const [updatedTotalValue, setUpdatedTotalValue] = useState(0);

  const assetsInSector = props.portfolios.flatMap(portfolio => {
    const matchedAssetGroup = portfolio.assets.find(asset => asset.label === props.selectedSector);
    return matchedAssetGroup && Array.isArray(matchedAssetGroup.assets)
      ? matchedAssetGroup.assets
      :[];
  });

  const selectedKey = Object.keys(props.sectorTotals).find(key => key === props.selectedSector);
  let totalValue = 0;
  if (selectedKey) {
    totalValue = props.sectorTotals[selectedKey]
  }

  useEffect(() => {
    if (props.selectedSector) {
      const stockSymbols = props.portfolios.flatMap(portfolio =>
        portfolio.assets.flatMap(asset => 
          asset.label === props.selectedSector && asset.assets
          ? asset.assets.map(a => a.label)
          : []
        )
      );

      let fetchCount = stockSymbols.length;
      
      for (const symbol of stockSymbols) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=KV57JAKXRGJOP9VW`
        fetch(url)
          .then(response => response.json())
          .then(data => {
            const dailyData = data["Time Series (Daily)"];
            const dates = Object.keys(dailyData);
            dates.sort();
            const lastDate = dates[dates.length - 1];
            const marketValue = dailyData[lastDate]["4. close"];
            const assetsInSector = props.portfolios.flatMap(portfolio => {
              const matchedAssetGroup = portfolio.assets.find(asset => asset.label === props.selectedSector);
              return matchedAssetGroup && Array.isArray(matchedAssetGroup.assets)
                ? matchedAssetGroup.assets
                :[];
            });
            const asset = assetsInSector.find(a => a.label === symbol);
            const initialValue = dailyData[asset.date]["4. close"];
            const shares = asset.value/initialValue;
            const currentValue = shares * marketValue;
            setCurrentValues(prevValues => ({
              ...prevValues,
              [symbol]: currentValue
            }));
          });
        }  
      }
    }, [props.portfolios, props.selectedSector]);
  
  useEffect(() => {
    const total = Object.values(currentValues).reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    setUpdatedTotalValue(total);
  }, [props.portfolios, currentValues]);
  
  const [smartAdjust, setSmartAdjust] = useState(false)


  return(
    <div>
      <Link to={"/sector/"}>
        <button>Return to Sector</button>
      </Link>
      <h1>{props.selectedSector.charAt(0).toUpperCase() + props.selectedSector.slice(1)}</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Initial Investment</th>
            <th>MKT Value</th>
            <th>% Change</th>
            <th>Initial Portfolio %</th>
            <th>Current Portfolio %</th>
            <th>Adjust Investment</th>
          </tr>
        </thead>
        <tbody>
          {assetsInSector.map((item, index) => (
          <tr key={index}>
            <td>{item.label}</td>
            <td>${item.value}</td>
            <td>${(currentValues[item.label] || 0).toFixed(2)}</td>
            <td>{(((currentValues[item.label] - item.value)/item.value) * 100).toFixed(2)}%</td>
            <td>{(item.value/totalValue * 100).toFixed(2)}%</td>
            <td>{((currentValues[item.label]/updatedTotalValue)*100).toFixed(2)}%</td>
            <td>
              <Link to={"/editassetform/"}>
                <button onClick={() => props.handleEditAsset(item)}>Edit</button>
              </Link>
                <button onClick={() => props.handleAssetDelete(item)}>X</button></td>
          </tr>
          ))}
        </tbody>
      </table>
      
      {smartAdjust === true ?
        <div>
          <h2>SmartAdjusted Portfolio</h2>
          <h4>Current Portfolio Value: ${updatedTotalValue.toFixed(2)}</h4>
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
            {assetsInSector.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>${(item.value/totalValue*100).toFixed(2)}%</td>
                <td>${(updatedTotalValue*(item.value/totalValue)).toFixed(2)}</td>
                <td>
                {
                currentValues[item.label] < (updatedTotalValue*(item.value/totalValue)) ? `Increase investment by $${((updatedTotalValue*(item.value/totalValue)) - currentValues[item.label]).toFixed(2)}.` : 
                currentValues[item.label] > (updatedTotalValue*(item.value/totalValue)) ? `Decrease investment by $${(currentValues[item.label] - (updatedTotalValue*(item.value/totalValue))).toFixed(2)}.`  :
                "Investment value remains the same."
                }
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        :
        <button onClick={()=> setSmartAdjust(true)}>SmartAdjust</button> 
      }
    </div>
  );
}

export default PositionsView;

