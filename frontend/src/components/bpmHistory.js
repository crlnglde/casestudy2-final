import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Header from './header';
import Footer from './footer';
import '../css/bpmlist.css';


Chart.register(...registerables);

const BpmHistory = () => {
  const [bpm, setBpm] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage state
  const itemsPerPage = 10; // Define itemsPerPage constant
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bpm.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page navigation
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const fetchBpm = async () => {
      try {
        const response = await axios.get('http://localhost:3000/bpm/getlist');
        setBpm(response.data.bpm);
        calculateStatusCounts(response.data.bpm);
      } catch (error) {
        console.error('Error fetching Bpm List:', error);
      }
    };

    fetchBpm();
  }, []);

  const calculateStatusCounts = (bpmData) => {
    const counts = bpmData.reduce((acc, curr) => {
      acc[curr.beatStatus] = (acc[curr.beatStatus] || 0) + 1;
      return acc;
    }, {});
    setStatusCounts(counts);
  };

  const handleAgeRangeChange = (event) => {
    setSelectedAgeRange(event.target.value);
  };

  // Filter data based on selected age range
  const filteredData = selectedAgeRange
    ? bpm.filter((data) => {
        const age = data.age;
        switch (selectedAgeRange) {
          case '18-25':
            return age >= 18 && age <= 25;
          case '26-35':
            return age >= 26 && age <= 35;
          case '36-45':
            return age >= 36 && age <= 45;
          case '46-55':
            return age >= 46 && age <= 55;
          case '56-65':
            return age >= 56 && age <= 65;
          case '65+':
            return age >= 65;
          default:
            return true;
        }
      })
    : bpm;

    // Count status for filtered data
  useEffect(() => {
    calculateStatusCounts(filteredData);
  }, [filteredData]);


  const statusColors = {
    'Slow Heart Rate': 'rgba(30, 144, 255, 0.6)', // DodgerBlue
    'Fast Heart Rate': 'rgba(0, 0, 255, 0.6)', // Blue
    'Normal Heart Rate': 'rgba(135, 206, 250, 0.6)', // LightSkyBlue
  };
  

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Status Counts',
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map((status) => statusColors[status] || statusColors.Undefined)
      }
    ]
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <br /><br />
        <h2 className="mb-4">BPM History</h2>
        <div className="col">

          <div className="select-container">
            <select className="select-dropdown" onChange={handleAgeRangeChange} value={selectedAgeRange}>
              <option value="">Select Age Range</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56-65">56-65</option>
              <option value="65+">65+</option>
            </select>
          </div>
          {/* Bar chart */}
          <div className="chart-container">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        fontSize: 30, // Adjust the font size here
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        </div>

        <table className="table table-striped mt-4" >
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Average Beat</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
          {currentItems.map((bpmData) => (
              <tr key={bpmData._id}>
                <td>{bpmData.name}</td>
                <td>{bpmData.age}</td>
                <td>{bpmData.sex}</td>

                <td>{bpmData.beatAvg}</td>
                <td>{bpmData.beatStatus}</td>
                <td>{new Date(bpmData.timestamp).toDateString()}</td>
              </tr>
            ))}
          </tbody>
          
        </table>

        <div className="pagination-container" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '100px'}}>
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <button onClick={nextPage} disabled={indexOfLastItem >= bpm.length}>Next</button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default BpmHistory;
