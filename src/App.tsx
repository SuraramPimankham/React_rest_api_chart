import React, { useState, useEffect } from 'react';
import './App.css';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';

function App() {
  const [content, setContent] = useState('data_analytics');
  const [entities, setEntities] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);

  const handleMenuClick = (content) => {
    setContent(content);

    const buttons = document.querySelectorAll('.sideMenu button');
    buttons.forEach(button => {
      button.classList.remove('active');
      if (button.textContent === content.toUpperCase().replace('_', ' ')) {
        button.classList.add('active');
      }
    });

    if (chartInstance !== null) {
      chartInstance.destroy();
    }
  };

  const createPieChart = (data) => {
    const ctx = document.getElementById('myPieChart');
    const intents = {};

    data.forEach(item => {
      const intent = item.intent.toLowerCase();
      if (intents[intent]) {
        intents[intent] += item.point;
      } else {
        intents[intent] = item.point;
      }
    });

    const labels = Object.keys(intents);
    const points = Object.values(intents);
    const totalPoints = points.reduce((acc, cur) => acc + cur, 0);
    const percentages = points.map(point => ((point / totalPoints) * 100).toFixed(2));

    const newChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: points,
          backgroundColor: [
            'red', 'blue', 'green', 'yellow', 'orange', 'purple'
          ],
          datalabels: {
            formatter: (value, context) => {
              return percentages[context.dataIndex] + '%';
            },
            color: '#fff',
            display: 'auto'
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || '';
                let value = context.parsed || 0;
                let percent = percentages[context.dataIndex];
                return `${label}: ${value} (${percent}%)`;
              }
            }
          }
        }
      }
    });

    setChartInstance(newChartInstance);
  };

  useEffect(() => {
    fetch('https://abc9563d-950b-4f2a-ad1d-08091c38fd1c.mock.pstmn.io/pies')
      .then(response => response.json())
      .then(data => {
        createPieChart(data);
      })
      .catch(error => console.error('Error fetching data:', error));

    return () => {
      if (chartInstance !== null) {
        chartInstance.destroy();
      }
    };
  }, [content]);

  useEffect(() => {
    fetch('https://abc9563d-950b-4f2a-ad1d-08091c38fd1c.mock.pstmn.io/entities')
      .then(response => response.json())
      .then(data => {
        setEntities(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    handleMenuClick('data_analytics');
  }, []);

  const handleAddWord = (index) => {
    const updatedEntities = [...entities];
    updatedEntities[index][Object.keys(updatedEntities[index])[0]].push('');
    setEntities(updatedEntities);
  };

  const handleDeleteWord = (entityIndex, synonymIndex) => {
    const updatedEntities = [...entities];
    updatedEntities[entityIndex][Object.keys(updatedEntities[entityIndex])[0]].splice(synonymIndex, 1);
    setEntities(updatedEntities);
  };
  
  return (
    <>
      <div className="container">
        <div className="sideMenu">
          <div className="cardMenu">
            <h2 className="menuName"> ADMIN CHATBOT</h2>
            <hr />
            <button className="ButtonDA" onClick={() => handleMenuClick('data_analytics')}>DATA ANALYTICS</button>
            <button className="ButtonI" onClick={() => handleMenuClick('intents')}>INTENTS</button>
            <button className="ButtonE" onClick={() => handleMenuClick('entities')}>ENTITIES</button>
            <button className="ButtonCF" onClick={() => handleMenuClick('conversation_flow')}>CONVERSATION FLOW</button>
            <button className="ButtonBL" onClick={() => handleMenuClick('business_logic')}>BUSINESS LOGIC</button>
            <button className="ButtonRB" onClick={() => handleMenuClick('rule_based')}>RULE BASED</button>
            <button className="ButtonNLP" onClick={() => handleMenuClick('nlp')}>NLP</button>
          </div>
        </div>
        <div className="content">
          {content === 'data_analytics' &&
            <div className="card-content">
              <h2>Pie Chart</h2>
              <div className="chart-container">
                <canvas id="myPieChart" width="100" height="100"></canvas>
              </div>
            </div>
          }
          {content === 'intents' && <div className="card-content"><h2>Intents Content</h2></div>}
          {content === 'entities' &&
            <div className="entities-container">
              <div className="card-entities-content-1">
                <h2>Entities Content 1</h2>
              </div>
              <div className="card-entities-content-2">
                <h2>Phrase</h2>
                <table>
                  <thead>
                    <tr>
                      <th className="tNameHead">VALUE</th>
                      <th className="tNameHead">SYNONYMS</th>
                    </tr>
                  </thead>
                  <tbody>
                  {entities.map((entity, entityIndex) => (
                      <tr key={entityIndex}>
                        <td>{Object.keys(entity)[0]}</td>
                        <td>
                          {entity[Object.keys(entity)[0]].map((synonym, synonymIndex) => (
                            <React.Fragment key={synonymIndex}>
                              <input
                                type="text"
                                value={synonym}
                                onChange={(e) => {
                                  const updatedEntities = [...entities];
                                  updatedEntities[entityIndex][Object.keys(entity)[0]][synonymIndex] = e.target.value;
                                  setEntities(updatedEntities);
                                }}
                                className="input-with-icon"
                              />
                              {synonym && (
                                <span className="delete-icon" onClick={() => handleDeleteWord(entityIndex, synonymIndex)}>X</span>
                              )}
                              {(synonymIndex === entity[Object.keys(entity)[0]].length - 1) &&  (
                                <button onClick={() => handleAddWord(entityIndex)}>Add Word</button>
                              )}
                            </React.Fragment>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
          {content === 'conversation_flow' && <div className="card-content"><h2>Conversation Flow Content</h2></div>}
          {content === 'business_logic' && <div className="card-content"><h2>Business Logic Content</h2></div>}
          {content === 'rule_based' && <div className="card-content"><h2>Rule Based Content</h2></div>}
          {content === 'nlp' && <div className="card-content"><h2>NLP Content</h2></div>}
        </div>
      </div>
    </>
  );
}

export default App;
