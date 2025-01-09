import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import UserProfile from "./components/UserProfile/UserProfile.jsx"
import LoginForm from "./components/LoginForm/LoginForm.jsx"
import RegisterForm from "./components/RegisterForm/RegisterForm.jsx"

function App(props) {
  const [data, setData] = useState({});
  const [portfolios, setPortfolios] = useState([]);
  const [user, setUser] = useState(null);

  useEffect (() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log(storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    console.log('User is set:', user);
    if (user) {
      axios
        .get(`http://localhost:8000/api/portfolios/?user_id=${user.id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setPortfolios(response.data);
        })
        .catch((error) => {
          console.error('Error fetching portfolios:', error);
        });
    } else {
      console.log('No user loggin in')
    }
  }, [user]);

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

  function getCSRFToken() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
  };

  function addNewPortfolioInput() {
    if (input) {
      const newPortfolio = {
        label: input,
      };
      console.log('Sending new portfolio', newPortfolio);
      const csrfToken = getCSRFToken()
      if (!csrfToken) {
        console.error('No CSRF token available');
        return;
      }
      axios.post(
        'http://localhost:8000/api/portfolios/', 
        newPortfolio, 
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setPortfolios([
          ...portfolios,
          response.data
        ]);
        cancelNewPortfolioInput();
      })
      .catch((error) => {
        console.error('Error adding new portfolio:', error);
      });
    }
  }

  function editPortfolio(oldLabel, newLabel) {
    setPortfolios(prevPortfolios =>
      prevPortfolios.map(portfolio =>
          portfolio.label === oldLabel
          ? { ...portfolio, label: newLabel }
          : portfolio
      )
    );
    const portfolioToUpdate = portfolios.find(portfolio => portfolio.label === oldLabel);

    if (portfolioToUpdate) {
      axios.put(
          `http://localhost:8000/api/portfolios/${portfolioToUpdate.id}/`,
          { label: newLabel },
          {
            headers: {
                'X-CSRFToken': getCSRFToken(),
                'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
      )
      .then(response => {
          console.log("Portfolio updated:", response.data);
      })
      .catch(error => {
          console.error("Error updating portfolio:", error);
      });
    }
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

    const portfolioToDelete = portfolios.find(portfolio => portfolio.label === portfolioLabel);

    if (portfolioToDelete) {
      axios.delete(
        `http://localhost:8000/api/portfolios/${portfolioToDelete.id}/`,
        {
          headers: {
              'X-CSRFToken': getCSRFToken(),
              'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then(response => {
        console.log("Portfolio deleted:", response.data);
      })
      .catch(error => {
        console.error("Error deleting portfolio:", error);
      });
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
      setPortfolios(prevPortfolios =>
        prevPortfolios.map(portfolio => {
          if (portfolio.label === selectedPortfolio) {
            return {
              ...portfolio,
              sectors: [
                ...portfolio.sectors,
                { label: input, portfolio: portfolio.id, assets: [] }  
              ]
            };
          }
          return portfolio;
        })
      );
      cancelNewSectorInput();
    }
  }

  function addNewSectorInput() {
    if (selectedPortfolio && input) {
      const portfolioObj = portfolios.find(portfolio => portfolio.label === selectedPortfolio);
      if (!portfolioObj) {
        console.error('Selected Portfolio not found');
        return
      }
      setPortfolios(prevPortfolios =>
        prevPortfolios.map(portfolio => {
          if (portfolio.label === selectedPortfolio) {
            return {
              ...portfolio,
              sectors: [
                ...portfolio.sectors,
                { label: input, portfolio: portfolioObj.id, asset:[] }
              ]
            };
          }
          return portfolio;
        })
      );
      
      axios.post(
        'http://localhost:8000/api/sectors/', 
        {
          label: input,
          portfolio: portfolioObj.id,
          asset: [],
        },
          {
            headers: {
              'X-CSRFToken': getCSRFToken(),  
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
      )
      .then(response => {
          console.log("New sector created:", response.data);
      })
      .catch(error => {
          console.error("Error adding new sector:", error);

          setPortfolios(prevPortfolios =>
            prevPortfolios.map(portfolio => {
              if (portfolio.label === selectedPortfolio) {
                return {
                  ...portfolio,
                  sectors: portfolio.sectors.filter(sector => sector.label !== input) 
                };
              }
              return portfolio;
            })
          );
      });
      cancelNewSectorInput();
    }
  }

  function editSector(portfolioLabel, oldSectorLabel, newSectorLabel) {
    const portfolio = portfolios.find(p => p.label === portfolioLabel);
    if (!portfolio) {
      console.error("Portfolio not found");
      return;
    }

    const sector = portfolio.sectors.find(s => s.label === oldSectorLabel);
    if (!sector) {
      console.error("Sector not found");
      return;
    }

    setPortfolios(prevPortfolios =>
      prevPortfolios.map(p => {
        if (p.label === portfolioLabel) {
          return {
            ...p,
            sectors: p.sectors.map(s =>
              s.label === oldSectorLabel
                ? { ...s, label: newSectorLabel }
                : s
            )
          };
        }
        return p;
      })
    );

    axios.put(
        `http://localhost:8000/api/sectors/${sector.id}/`,
        { 
          label: newSectorLabel,
          portfolio: portfolio.id
        },
        {
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
    )
    .then(response => {
        console.log('Sector updated:', response.data);
    })
    .catch(error => {
        console.error('Error updating sector:', error);
    });
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
    const portfolio = portfolios.find(p => p.label === portfolioLabel);
    if (!portfolio) {
      console.error("Portfolio not found");
      return;
    }

    const sector = portfolio.sectors.find(s => s.label === sectorLabel);
    if (!sector) {
      console.error("Sector not found");
      return;
    }

    setPortfolios(prevPortfolios =>
      prevPortfolios.map(p => {
        if (p.label === portfolioLabel) {
          return {
            ...p,
            sectors: p.sectors.filter(s => s.label !== sectorLabel)
          };
        }
        return p;
      })
    );

    axios.delete(
      `http://localhost:8000/api/sectors/${sector.id}/`,
      {
        headers: {
          'X-CSRFToken': getCSRFToken(),
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
    .then(response => {
      console.log('Sector deleted:', response.data);
    })
    .catch(error => {
      console.error('Error deleting sector:', error);
    });
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
    const uppercaseAsset = {
      ...asset,
      label: asset.label.toUpperCase(),
    };

    const portfolio = portfolios.find(p => p.label === portfolioLabel);
    const sector = portfolio?.sectors.find(s => s.label === sectorLabel);
    const portfolioId = portfolio.id;
    const sectorId = sector.id;

    axios
      .post(
        'http://localhost:8000/api/assets/', 
        {
          ...uppercaseAsset,
          sector: sectorId,
          portfolio: portfolioId,
        },
        {
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setPortfolios((prevPortfolios) =>
          prevPortfolios.map((portfolio) => {
            if (portfolio.label === portfolioLabel) {
              return {
                ...portfolio,
                sectors: portfolio.sectors.map((sector) => {
                  if (sector.label === sectorLabel) {
                    return {
                      ...sector,
                      assets: [
                        ...sector.assets,
                        { ...uppercaseAsset, id: response.data.id },
                      ],
                    };
                  }
                  return sector;
                }),
              };
            }
            return portfolio;
          })
        );

        setInputValue('');
        setAssetValue('');
        setAssetDate('');
      })
      .catch((error) => {
        console.error('Error adding asset:', error);
      });
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
      
      const updatedAsset = {
        ...editedAsset,
        value: parseFloat(newValue),
        date: newDate,
      };

      axios
        .put(
          `http://localhost:8000/api/assets/${editedAsset.id}/`,
          updatedAsset,
          {
            headers: {
              'X-CSRFToken': getCSRFToken(),
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          setPortfolios((prevPortfolios) =>
            prevPortfolios.map((portfolio) => {
              return {
                ...portfolio,
                sectors: portfolio.sectors.map((sector) => {
                  if (sector.label === selectedSector) {
                    return {
                      ...sector,
                      assets: sector.assets.map((asset) => {
                        if (asset.id === editedAsset.id) {
                          return {
                            ...asset,
                            value: parseFloat(newValue),
                            date: newDate,
                          };
                        }
                        return asset;
                      }),
                    };
                  }
                  return sector;
                }),
              };
            })
          );
          setEditedAsset(null);
          setNewValue('');
          setNewDate('');
        })
        .catch((error) => {
          console.error('Error editing asset:', error);
        });
    }
  }

  function handleAssetCancelClick() {
    setEditedAsset(null);
    setNewValue('');
    setNewDate('');
  }

  function handleAssetDelete(assetToDelete) {
    axios
      .delete(
        `http://localhost:8000/api/assets/${assetToDelete.id}/`,
        {
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        const updatedPortfolios = portfolios.map(portfolio => {
          return {
            ...portfolio,
            sectors: portfolio.sectors.map(assetGroup => {
              if (assetGroup.label === selectedSector) {
                return {
                  ...assetGroup,
                  assets: assetGroup.assets.filter(asset => asset.id !== assetToDelete.id)
                };
              }
              return assetGroup;
            })
          };
        });

        setPortfolios(updatedPortfolios);

        setCurrentValues(prevValues => {
          const updatedValues = { ...prevValues };
          const assetSymbol = assetToDelete.label;
          delete updatedValues[assetSymbol];
          return updatedValues;
        });
      })
      .catch((error) => {
        console.error('Error deleting asset:', error);
      });
  }

  const [totalValue, setTotalValue] = useState(0);
  const [sectorTotals, setSectorTotals] = useState(0);
  const [portfolioTotals, setPortfolioTotals] = useState(0);

  function calculateTotalValue() {
    let total = 0;

    portfolios.forEach(portfolio => {
      if (Array.isArray(portfolio.sectors)) {
        portfolio.sectors.forEach(sector => {
          if (Array.isArray(sector.assets)) {
            sector.assets.forEach(asset => {
              if (typeof asset.value === 'number') {
                total += asset.value;
              }
            });
          }
        });
      }
    });

    return total;
  }

  function calculatePortfolioValue() {
    return portfolios.map(portfolio => {
      let portfolioTotal = 0;

      // Ensure portfolio.sectors is an array before iterating
      if (Array.isArray(portfolio.sectors)) {
        portfolio.sectors.forEach(sector => {
          // Ensure sector.assets is an array before iterating
          if (Array.isArray(sector.assets)) {
            sector.assets.forEach(asset => {
              // Sum the value of each asset
              portfolioTotal += asset.value;
            });
          }
        });
      }

      return portfolioTotal;
    });
  }

  function calculateSectorTotals() {
    let totals = {};

    portfolios.forEach(portfolio => {
      portfolio.sectors.forEach(sector => {
        if (Array.isArray(sector.assets)) {
          // If assets are an array, calculate the total value of all assets in that sector
          const sectorTotal = sector.assets.reduce((sum, item) => sum + item.value, 0);
          totals[sector.label] = (totals[sector.label] || 0) + sectorTotal;
        }
      });
    });

    return totals;
  }

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
        portfolio.sectors.flatMap(sector =>  
          sector.label === selectedSector && sector.assets
            ? sector.assets.map(asset => asset.label)
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
      // Ensure portfolio.sectors is an array before iterating
      if (Array.isArray(portfolio.sectors)) {
        portfolio.sectors.forEach(sector => {
          // Ensure sector.assets is an array before iterating
          if (Array.isArray(sector.assets)) {
            sector.assets.forEach(asset => {
              // If asset has nested assets, ensure asset.assets is an array before iterating
              if (Array.isArray(asset.assets)) {
                asset.assets.forEach(item => {
                  if (sector.label === selectedSector) {
                    const percentage = (item.value / total) * 100;
                    seriesData.push({
                      name: item.label,
                      data: percentage,
                    });
                  }
                });
              } else {
                if (sector.label === selectedSector) {
                  const percentage = (asset.value / total) * 100;
                  seriesData.push({
                    name: asset.label,
                    data: percentage,
                  });
                }
              }
            });
          }
        });
      }
    });

    setCircleChartData({
      categories: ['Assets'],
      series: seriesData,
    });

  }, [portfolios, selectedSector]);

  const circleOptions = {
    chart: { title: 'Portfolio Percentage', width: 600, height: 400 },
  };
  //Asset Form state
  const [assetLabel, setAssetLabel] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetDate, setAssetDate] = useState('');

  function handleAddAsset() {
    if (selectedPortfolio && selectedSector && assetLabel && assetValue && assetDate) {
      addAsset(selectedPortfolio, selectedSector, { label: assetLabel, value: parseFloat(assetValue), date: assetDate });
      setAssetLabel('');
      setAssetValue('');
      setAssetDate('');
    }
  }
  //positions view state
  const [currentValues, setCurrentValues] = useState({});
  const [sectorMarketValues, setSectorMarketValues] = useState({});
  const [updatedTotalValue, setUpdatedTotalValue] = useState(0);

  const assetsInSector = portfolios.flatMap(portfolio => {
    return portfolio.sectors.flatMap(sector => {
      if (sector.label === selectedSector) {
        return sector.assets;
      }
      return [];
    });
  });
  
  const assetsInPortfolio = portfolios.flatMap(portfolio => {
    if (portfolio.label === selectedPortfolio) {
      return portfolio.sectors.flatMap(sector => sector.assets);
    }
    return []; 
  });

  const selectedKey = Object.keys(sectorTotals).find(key => key === selectedSector);
  let totalAssetValue = 0;
  if (selectedKey) {
    totalAssetValue = sectorTotals[selectedKey]
  }

  useEffect(() => {
    if (selectedSector) {
      const stockSymbols = portfolios.flatMap(portfolio =>
        portfolio.sectors.flatMap(sector =>  
          sector.label === selectedSector && sector.assets
            ? sector.assets.map(asset => asset.label)
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
      } else if (selectedPortfolio) {
          const stockSymbols = portfolios.flatMap(portfolio =>
            portfolio.label === selectedPortfolio
              ? portfolio.sectors.flatMap(sector =>
                  sector.assets ? sector.assets.map(a => a.label) : []
                )
              : []
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
                const asset = assetsInPortfolio.find(a => a.label === symbol);
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
        }, [portfolios, selectedSector, selectedPortfolio]);
  
  useEffect(() => {
    const calculateSectorMarketValues = () => {
      let sectorValues = {};

      portfolios.forEach(portfolio => {
        // Ensure portfolio.sectors is an array before iterating
        if (Array.isArray(portfolio.sectors)) {
          portfolio.sectors.forEach(sector => {
            // Ensure sector.assets is an array before reducing
            if (Array.isArray(sector.assets)) {
              const sectorName = sector.label;
              let sectorTotal = sector.assets.reduce((total, asset) => {
                // Get the current value from currentValues, defaulting to 0
                const currentValue = currentValues[asset.label] || 0;
                return total + currentValue;
              }, 0);

              if (sectorTotal > 0) {
                sectorValues[sectorName] = sectorTotal;
              }
            }
          });
        }
      });

      setSectorMarketValues(sectorValues);
    };

    calculateSectorMarketValues();
  }, [currentValues, portfolios]);

  useEffect(() => {
    const total = Object.values(currentValues).reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
    setUpdatedTotalValue(total);
  }, [portfolios, currentValues]);

  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentValues({});
      setSelectedPortfolio('');
      setSelectedSector('');
      setSmartAdjust(false);
    }
  }, [location.pathname]);
  
  const [smartAdjust, setSmartAdjust] = useState(false)

  //auto-complete
  const [stockSuggestions, setStockSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(props.assetLabel || '');
  const [stockLabels, setStockLabels] = useState([]);
  const maxSuggestions = 5;
  
  useEffect(() => {
    if (inputValue) {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=KV57JAKXRGJOP9VW`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.bestMatches) {
            const suggestions = data.bestMatches.map((match) => ({
              symbol: match["1. symbol"],
              name: match["2. name"],
            }));
            setStockLabels(suggestions);
          } else {
            setStockLabels([]);
          }
        })
    }
  }, [inputValue])

  useEffect (() => {
    if (inputValue) {
      const filteredSuggestions = stockLabels.filter((label) => 
        label.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
        label.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setStockSuggestions(filteredSuggestions.slice(0, maxSuggestions));
    } else {
        setStockSuggestions([]);
    }
  }, [inputValue, stockLabels]);

  function handleInputChange(ev) {
    setInputValue(ev.target.value);
    setAssetLabel(ev.target.value);
  }

  function handleSuggestionClick(suggestion) {
    setInputValue(suggestion.symbol);
    setAssetLabel(suggestion.symbol); 
    setStockSuggestions([]); 
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
              assetsInSector={assetsInSector}
              currentValues={currentValues}
              totalAssetValue={totalAssetValue}
              updatedTotalValue={updatedTotalValue}
              setSmartAdjust={setSmartAdjust}
              smartAdjust={smartAdjust}
            />
          }
        />
        <Route
          path="/portfolio/"
          element= {
            <PortfolioView
              setChoosePortfolio={setChoosePortfolio}
              selectedPortfolio={selectedPortfolio}
              selectedSector={selectedSector}
              setChooseSector={setChooseSector}
              portfolios={portfolios}
              sectorTotals={sectorTotals}
              handleEditAsset={handleEditAsset}
              handleAssetDelete={handleAssetDelete}
              assetsInSector={assetsInSector}
              currentValues={currentValues}
              totalAssetValue={totalAssetValue}
              updatedTotalValue={updatedTotalValue}
              setSmartAdjust={setSmartAdjust}
              smartAdjust={smartAdjust}
              sectorTotals={sectorTotals}
              deleteSector={deleteSector}
              sectorMarketValues={sectorMarketValues}
              selectSector={selectSector}
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
              handleAssetDelete={handleAssetDelete}
              user={user}
              setUser={setUser}
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
              assetLabel={assetLabel}
              setAssetLabel={setAssetLabel}
              assetValue={assetValue}
              setAssetValue={setAssetValue}
              assetDate={assetDate}
              setAssetDate={setAssetDate}
              handleAddAsset={handleAddAsset}
              stockSuggestions={stockSuggestions}
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              handleSuggestionClick={handleSuggestionClick}
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
        <Route
          path="/profile/"
          element={
            <UserProfile
              user={user}
            />
          }
        />
        <Route
          path="/login/"
          element={
            <LoginForm
              setUser={setUser}
            />
          }
        />
        <Route
          path="/register/"
          element={
            <RegisterForm
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

