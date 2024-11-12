import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LineChart, PieChart } from '@toast-ui/react-chart';
import '@toast-ui/chart/dist/toastui-chart.css';
import './App.css';

import PortfolioList from "./components/PortfolioList/PortfolioList.jsx"
import PortfolioView from "./components/PortfolioView/PortfolioView.jsx"
import SectorView from "./components/SectorView/SectorView.jsx"
import PositionsView from "./components/PositionsView/PositionsView.jsx"
import AddAssetForm from "./components/AddAssetForm/AddAssetForm.jsx"
import EditAssetForm from "./components/EditAssetForm/EditAssetForm.jsx"

function App(props) {
  const [data, setData] = useState({});
  const [portfolios, setPortfolios] = useState([{
      label: "portfolio 1",
      assets: [ 
        {
          label: "stocks",
          assets: [
            { label: "NVDA", value: 1000, date: '2024-09-05' },
            { label: "AMZN", value: 1000, date: '2024-09-05' }
          ]
        },
      ]
    }]);

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

  function editPortfolio(oldLabel, newLabel) {
    setPortfolios(prevPortfolios =>
      prevPortfolios.map(portfolio =>
        portfolio.label === oldLabel
        ? {...portfolio, label: newLabel}
        : portfolio
        )
      );
  }

  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  function handlePortfolioEditClick(portfolio) {
    setEditingPortfolio(portfolio.label);
    setNewPortfolioName(portfolio.label);
    console.log('Editing...')
  }

  function handlePortfolioSaveClick(oldlabel) {
    if (newPortfolioName.trim() !== '') {
      editPortfolio(editingPortfolio, newPortfolioName);
      setEditingPortfolio(null);
    }
  }

  function handlePortfolioCancelClick() {
    setEditingPortfolio(null);
    setNewPortfolioName('');
  }

  function deletePortfolio(portfolioLabel) {
    setPortfolios(prevPortfolios =>
      prevPortfolios.filter(portfolio => portfolio.label !== portfolioLabel)
    );
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

  function editSector(portfolioLabel, oldSectorLabel, newSectorLabel) {
    setPortfolios(prevPortfolios =>
      prevPortfolios.map(portfolio => {
        if (portfolio.label === portfolioLabel) {
          return {
            ...portfolio,
            assets: portfolio.assets.map(sector =>
              sector.label === oldSectorLabel
              ? {...sector, label: newSectorLabel}
              : sector
            )
          };
        }
        return portfolios;
      })
    );
  }

  const [editingSector, setEditingSector] = useState(null);
  const [newSectorName, setNewSectorName] = useState('');

  function handleSectorEditClick(sector) {
    setEditingSector(sector.label);
    setNewSectorName(sector.label);
    console.log('Editing...');
  }

  function handleSectorSaveClick(portfolioLabel) {
    if (newSectorName.trim() !== '') {
      editSector(portfolioLabel, editingSector, newSectorName);
      setEditingSector(null);
    }
  }

  function handleSectorCancelClick() {
    setEditingSector(null);
    setNewSectorName('');
  }

  function deleteSector(portfolioLabel, sectorLabel) {
    setPortfolios(prevPortfolios =>
      prevPortfolios.map(portfolio => {
        if (portfolio.label === portfolioLabel) {
          return {
            ...portfolio,
            assets:portfolio.assets.filter(sector => sector.label !== sectorLabel)
          };
        }
        return portfolio;
      })
    );
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

  const [editedAsset, setEditedAsset] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [newDate, setNewDate]= useState('');

  function handleEditAsset(asset) {
    setEditedAsset(asset);
    setNewValue(asset.value);
    setNewDate(asset.date);
  }

  function handleAssetEditSave() {
    if (editedAsset && newValue !== '') {
      const updatedPortfolios = portfolios.map(portfolio => {
        return {
          ...portfolio,
          assets: portfolio.assets.map(assetGroup => {
            if (assetGroup.label === selectedSector) {
              return {
                ...assetGroup,
                assets: assetGroup.assets.map(a => {
                  if (a.label === editedAsset.label) {
                    return { ...a, value: parseFloat(newValue), date: newDate };
                  }
                  return a;
                })
              };
            }
            return assetGroup;
          })
        };
      });
      setPortfolios(updatedPortfolios);
      setEditedAsset(null);
      setNewValue('');
      setNewDate('');
    }
  };

  function handleAssetCancelClick() {
    setEditedAsset(null);
    setNewValue('');
    setNewDate('');
  }

  function handleAssetDelete(assetToDelete) {
    const updatedPortfolios = portfolios.map(portfolio => {
      return {
        ...portfolio,
        assets: portfolio.assets.map(assetGroup => {
          if (assetGroup.label === selectedSector) {
            return {
              ...assetGroup,
              assets: assetGroup.assets.filter(asset => asset !== assetToDelete) 
            };
          }
          return assetGroup;
        })
      };
    });

    setPortfolios(updatedPortfolios);
  }

  const [totalValue, setTotalValue] = useState(0);
  const [sectorTotals, setSectorTotals] = useState(0);
  const [portfolioTotals, setPortfolioTotals] = useState(0);

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

  function calculatePortfolioValue() {
    return portfolios.map(portfolio => {
      let portfolioTotal = 0
      portfolio.assets.forEach(asset => {
        if (Array.isArray(asset.assets)) {
          asset.assets.forEach(item => {
            portfolioTotal += item.value;
          });
        } else {
          portfolioTotal += asset.value;
        }
      });
      return portfolioTotal;
    ;})
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
    const portfolioTotal = calculatePortfolioValue();

    setTotalValue(total);
    setSectorTotals(totals);
    setPortfolioTotals(portfolioTotal);
  }, [portfolios]);

  const [apiData, setApiData] = useState(null);
  const [chartData, setChartData] = useState({ categories: [], series: [] });
  const [timeRange, setTimeRange] = useState(12);

  useEffect(() => {
    if (selectedSector) {
      const stockSymbols = portfolios.flatMap(portfolio =>
        portfolio.assets.flatMap(asset => 
          asset.label === selectedSector && asset.assets
          ? asset.assets.map(a => a.label)
          : []
        )
      );

      const newChartData = {
          categories: [],
          series: []
      };

      let fetchCount = stockSymbols.length;
      const maxDataPoints = timeRange;

      for (const symbol of stockSymbols) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=KV57JAKXRGJOP9VW`
        fetch(url)
          .then(response => response.json())
          .then(data => {
            const monthlyData = data["Monthly Time Series"];
          
            if (Object.keys(monthlyData).length > 0) {
              const dates = Object.keys(monthlyData).reverse();
              const prices = dates.map(date => parseFloat(monthlyData[date]["4. close"]));
              
              const limitedDates = dates.slice(-maxDataPoints);
              const limitedPrices = prices.slice(-maxDataPoints);
              
              if (newChartData.categories.length === 0) {
                newChartData.categories = limitedDates;
              }
              
              newChartData.series.push({
                name: symbol,
                data: limitedPrices
              });
              fetchCount--;
              if (fetchCount <= 0) {
                console.log("All Data received!")
                setChartData(newChartData);
              }
            }
          });
      }
    }
  }, [portfolios, selectedSector, timeRange]);

  const options = {
    chart: { title: 'Stocks Monthly Closing Prices', width: 1000, height: 500 },
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

  const [circleChartData, setCircleChartData] = useState({ categories: [], series: [] });

  function handleTimeRangeChange(range) {
    setTimeRange(range);
    console.log('Button Clicked:', range);
  };

  useEffect(() => {
    const total = calculateTotalValue();
    const portfolioTotals = calculatePortfolioValue();
    const sectorTotals = calculateSectorTotals();

    setTotalValue(total);
    setPortfolioTotals(portfolioTotals);
    setSectorTotals(sectorTotals);

    const seriesData = [];
    portfolios.forEach(portfolio => {
      portfolio.assets.forEach(asset => {
        if (Array.isArray(asset.assets)) {
          asset.assets.forEach(item => {
            if (asset.label === selectedSector) { 
              const percentage = (item.value / total) * 100; 
              seriesData.push({
                name: item.label,
                data: percentage
              });
            }
          });
        } else {
          if (asset.label === selectedSector) { 
            const percentage = (asset.value / total) * 100; 
            seriesData.push({
              name: asset.label,
              data: percentage
            });
          }
        }
      });
    });
    setCircleChartData({
      categories: ['Assets'],
      series: seriesData,
    });
  }, [portfolios, selectedSector]);

  const circleOptions = {
    chart: { title: 'Portfolio Percentage', width: 600, height: 400 },
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
              circleChartData={circleChartData}
              circleOptions={circleOptions}
              handleTimeRangeChange={handleTimeRangeChange}
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
              portfolios={portfolios}
              sectorTotals={sectorTotals}
              handleEditAsset={handleEditAsset}
              handleAssetDelete={handleAssetDelete}
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
              portfolioTotals={portfolioTotals}
              editPortfolio={editPortfolio}
              newPortfolioName={newPortfolioName}
              setNewPortfolioName={setNewPortfolioName}
              handlePortfolioSaveClick={handlePortfolioSaveClick}
              handlePortfolioCancelClick={handlePortfolioCancelClick}
              handlePortfolioEditClick={handlePortfolioEditClick}
              editingPortfolio={editingPortfolio}
              deletePortfolio={deletePortfolio}
              editSector={editSector}
              editingSector={editingSector}
              newSectorName={newSectorName}
              setNewSectorName={setNewSectorName}
              handleSectorSaveClick={handleSectorSaveClick}
              handleSectorCancelClick={handleSectorCancelClick}
              handleSectorEditClick={handleSectorEditClick}
              deleteSector={deleteSector}
              handleEditAsset={handleEditAsset}
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
        <Route
          path="/editassetform/"
          element={
            <EditAssetForm
              selectedPortfolio={selectedPortfolio}
              setSelectedPortfolio={setSelectedPortfolio}
              portfolios={portfolios}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              newValue={newValue}
              setNewValue={setNewValue}
              newDate={newDate}
              setNewDate={setNewDate}
              handleAssetEditSave={handleAssetEditSave}
              editedAsset={editedAsset}
              handleAssetCancelClick={handleAssetCancelClick}
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

