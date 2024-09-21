import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Collapse } from "antd";
import './App.css';

import PortfolioList from "./components/PortfolioList/PortfolioList.jsx"
import PortfolioView from "./components/PortfolioView/PortfolioView.jsx"
import SectorView from "./components/SectorView/SectorView.jsx"
import PositionsView from "./components/PositionsView/PositionsView.jsx"
import AddAssetForm from "./components/AddAssetForm/AddAssetForm.jsx"

function App(props) {
  const [data, setData] = useState({});
  const [portfolios, setPortfolios] = useState([
    {
      label: "portfolio 1",
      assets: [ 
        {
          label: "stocks",
          assets: [
            { label: "NVDA", value: 1000 },
            { label: "AMZN", value: 1000 }
          ]
        },
        {
          label: "crypto",
          assets: [
            { label: "BTC", value: 5000 },
            { label: "ETH", value: 500 }
          ]
        },
        { label: "cash", value: 10000 }
      ]
    }
  ]);

  const [newPortfolio, setNewPortfolio] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [chooseSector, setChooseSector] = useState(false);
  const [choosePortfolio, setChoosePortfolio] = useState(false);
  const [newSector, setNewSector] = useState(false);
  const [input, setInput] = useState('');

  function handleNewPortfolioClick() {
    setNewPortfolio(true);
  }

  function cancelNewPortfolioInput() {
    setNewPortfolio(false);
    setInput('');
  }

  function handleNewInput(ev) {
    setInput(ev.target.value);
  }

  function addNewPortfolioInput() {
    if (input) {
      setPortfolios([
        ...portfolios,
        { label: input, assets: [] }
      ]);
      cancelNewPortfolioInput();
    }
  }

  function handleNewSectorClick(portfolioLabel) {
    setSelectedPortfolio(portfolioLabel);
    setNewSector(true);
  }

  function cancelNewSectorInput() {
    setNewSector(false);
    setInput('');
  }

  function addNewSectorInput() {
    if (selectedPortfolio && input) {
      setPortfolios(portfolios.map(portfolio => {
        if (portfolio.label === selectedPortfolio) {
          return {
            ...portfolio,
            assets: [
              ...portfolio.assets,
              { label: input, assets: [] }
            ]
          };
        }
        return portfolio;
      }));
      cancelNewSectorInput();
    }
  }

  function selectSector(sectorLabel) {
    setSelectedSector(sectorLabel);
    setChooseSector(true);
  }

  function selectPortfolio(portfolioLabel) {
    setSelectedPortfolio(portfolioLabel);
    setChoosePortfolio(true);
  }

  function addAsset(portfolioLabel, sectorLabel, asset) {
      setPortfolios(prevPortfolios =>
        prevPortfolios.map(portfolio => {
          if (portfolio.label === portfolioLabel) {
            return {
              ...portfolio,
              assets: portfolio.assets.map(sector =>{
                if (sector.label === sectorLabel) {
                  return {
                    ...sector,
                    assets: [...sector.assets, asset]
                  };
                }
                return sector;
              })
            };
          }
          return portfolio;
        })
      );
  }

  const [totalValue, setTotalValue] = useState(0);
  const [sectorTotals, setSectorTotals] = useState(0);
  function calculateTotalValue() {
    let total = 0
    portfolios.forEach(portfolio => {
      portfolio.assets.forEach(asset => {
        if (Array.isArray(asset.assets)) {
          asset.assets.forEach(item => {
            total += item.value;
          });
        } else {
          total += asset.value;
        }
      })
    })
    return total;
  };
  function calculateSectorTotals() {
    let totals = {}
    portfolios.forEach(portfolio => {
      portfolio.assets.forEach(asset => {
        if (Array.isArray(asset.assets)) {
          const sectorTotal = asset.assets.reduce((sum,item) => sum + item.value, 0);
          totals[asset.label] = (totals[asset.label] || 0) + sectorTotal;
        } else {
          totals[asset.label] = (totals[asset.label] || 0) + asset.value;
        }
      });
    });
    return totals;
  };
  useEffect(() => {
    const total = calculateTotalValue();
    const totals = calculateSectorTotals();
    setTotalValue(total);
    setSectorTotals(totals)
  }, [portfolios]);

  const [apiData, setApiData] = useState(null);
  const [datesArray, setDatesArray] = useState([]);
  const [pricesArray, setPricesArray] = useState([]);

  useEffect(() => {
    const url = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=VTI&apikey=KV57JAKXRGJOP9VW"
    fetch(url)
    .then(response => response.json())
    .then(fetchedData => {
      setApiData(fetchedData);
    })
  }, []);

  useEffect(() => {
    if (apiData && apiData["Monthly Time Series"]) {
      const monthlyTimeSeriesData = apiData["Monthly Time Series"];
      const dates = Object.keys(monthlyTimeSeriesData).reverse();
      const prices = dates.map(date => parseFloat(monthlyTimeSeriesData[date]["4. close"]));
      setDatesArray(dates);
      setPricesArray(prices);
    }
  }, [apiData]);
  
  const chartData = {
    categories: datesArray,
    series: [
      {
        name: 'VTI',
        data: pricesArray
      },
    ],
  };

  const options = {
    chart: { title: 'VTI Monthly Closing Prices', width: 1000, height: 500 },
    xAxis: {
      title: 'Month',
    },
    yAxis: {
      title: 'Price ($)',
    },
    tooltip: {
      formatter: (value) => `$${value}`,
    },
    legend: {
      align: 'bottom',
    },
  };

  function renderItems(items) {
    if (!Array.isArray(items)) {
      console.error('Expected an array but got', items);
      return null;
    }

    return (
      <ul>
        {items.map((item, index) => (
          <li className="SA-portfolio-investments" key={index}>
            {item.label} {item.value ? `: $${item.value}` : ''}
            {item.assets && item.assets.length > 0 && renderItems(item.assets)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
    <Router>
      <Routes>
        <Route
          path="/sector/"
          element= {
            <SectorView
              setChooseSector={setChooseSector}
              selectedSector={selectedSector}
              selectedPortfolio={selectedPortfolio}
              chartData={chartData}
              options={options}
            />
          }
        />
        <Route
          path="/positions/"
          element={
            <PositionsView
              selectedSector={selectedSector}
              selectedPortfolio={selectedPortfolio}
              setChooseSector={setChooseSector}
            />
          }
        />
        <Route
          path="/portfolio/"
          element= {
            <PortfolioView
              setChoosePortfolio={setChoosePortfolio}
              selectedPortfolio={selectedPortfolio}
            />
          }
        />
        <Route
          path="/"
          element={
            <PortfolioList
              portfolios={portfolios}
              selectPortfolio={selectPortfolio}
              selectSector={selectSector}
              renderItems={renderItems}
              handleNewSectorClick={handleNewSectorClick}
              addNewSectorInput={addNewSectorInput}
              cancelNewSectorInput={cancelNewSectorInput}
              handleNewPortfolioClick={handleNewPortfolioClick}
              addNewPortfolioInput={addNewPortfolioInput}
              cancelNewPortfolioInput={cancelNewPortfolioInput}
              newSector={newSector}
              newPortfolio={newPortfolio}
              input={input}
              handleNewInput={handleNewInput}
              selectedPortfolio={selectedPortfolio}
              totalValue={totalValue}
              sectorTotals={sectorTotals}
            />
          }
        />
        <Route
          path="/addassetform/"
          element={
            <AddAssetForm
              selectedPortfolio={selectedPortfolio}
              setSelectedPortfolio={setSelectedPortfolio}
              portfolios={portfolios}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              addAsset={addAsset}
            />
          }
        />
      )}
      </Routes>
    </Router>
    </>
  );
}

export default App;

