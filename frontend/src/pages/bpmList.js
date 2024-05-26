// Import the useEffect and useState hooks
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import Header from '../components/header';
import Footer from '../components/footer';
import '../css/bpmlist.css';

const BpmList = () => {
  // State variables
  const [bpm, setBpm] = useState([]);
  const [latestBpm, setLatestBpm] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Beats',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
      },
    ],
  });

  // Function to fetch BPM data
  const fetchBpmData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bpm/getlist');
      setBpm(response.data.bpm);
      if (response.data.bpm.length > 0) {
        const latest = response.data.bpm[response.data.bpm.length - 1];
        setLatestBpm(latest);
        updateChartData(latest);
      }
    } catch (error) {
      console.error('Error fetching BPM data:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const { name, age, sex } = e.target.elements; // Get form input values
    const bpmId = latestBpm._id; // Get BPM ID
    try {
      // Send PUT request to update BPM data
      const beatAvg = latestBpm.beatAvg;
      await axios.put(`http://localhost:3000/bpm/update/${bpmId}`, {
        name: name.value,
        age: age.value,
        sex: sex.value,
        beatAvg: beatAvg
      });
      // Fetch updated BPM data
      fetchBpmData();
    } catch (error) {
      console.error('Error updating BPM data:', error);
    }
  };

  // Function to update chart data
  const updateChartData = (data) => {
    const { bpmReadings } = data;
    const labels = bpmReadings.map((reading) => (reading.bpmtime / 1000));
    const beats = bpmReadings.map((reading) => reading.beats);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Beats',
          data: beats,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: false,
        },
      ],
    });
  };

  // useEffect to fetch BPM data and set up socket connection
  useEffect(() => {
    fetchBpmData(); // Fetch BPM data on component mount

    // Set up socket connection
    const socket = io('http://localhost:3000');
    socket.on('newBpmData', (newData) => {
      setLatestBpm(newData);
      updateChartData(newData);
      window.location.reload();
    });

    window.addEventListener('focus', () => {
      fetchBpmData(); // Fetch updated BPM data
    });

    // Clean up function to disconnect socket
    return () => {
      socket.disconnect();
      window.removeEventListener('focus', () => {});
    };
  }, []);

  // Render JSX
  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2 className="title mb-4">BPM Monitoring</h2>

        <Line data={chartData} />
        <form onSubmit={handleSubmit}>
          
        <div className="bpmf">
          <label htmlFor="beatAvg" className="form-label">Beat Average:</label>
          <input type="text" id="beatAvg" name="beatAvg" className="form-control" value={latestBpm?.beatAvg} readOnly />
          <label htmlFor="beatStatus" className="form-label">Status:</label>
          <input type="text" id="beatStatus" name="beatStatus" className="form-control" Value={latestBpm?.beatStatus || '...'} readOnly />
          <label htmlFor="date" className="form-label">Date:</label>
          <input type="text" id="date" name="date" className="form-control" value={latestBpm ? new Date(latestBpm.timestamp).toLocaleString() : ''} readOnly />

          
        </div>

        {(!latestBpm?.name && !latestBpm?.age) ? (
            <div>
              <div className="bpmf1">
              <label htmlFor="name" className="form-label">Name:</label>
              <input type="text" id="name" name="name" className="form-control mb-3" defaultValue={latestBpm?.name || ''} placeholder="Enter your name" />
              <label htmlFor="age" className="form-label">Age:</label>
              <input type="number" id="age" name="age" className="form-control mb-3" defaultValue={latestBpm?.age || ''} placeholder="Enter your age" />
              <label htmlFor="sex" className="form-label">Sex:</label>
              <select id="sex" name="sex" className="form-control mb-3" defaultValue={latestBpm?.sex || ''}>
                  <option value="" disabled>Select your sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
              </select>
              </div>

              <div >
                <button type="submit" className="btn btn-primary">Save</button>
              </div>

            </div>

            
            
          ) : (
            <div className="bpmf1">
              <label htmlFor="name" className="form-label">Name:</label>
              <input type="text" id="name" name="name" className="form-control mb-3" value={latestBpm?.name} readOnly />
              <label htmlFor="age" className="form-label">Age:</label>
              <input type="number" id="age" name="age" className="form-control mb-3" value={latestBpm?.age} readOnly />
              <label htmlFor="sex" className="form-label">Sex:</label>
              <input type="text" id="sex" name="sex" className="form-control mb-3" value={latestBpm?.sex} readOnly />
            </div>
          )}


          
        </form>

        <div className="lower-portion">
      
        </div>
        
      </div>

      
      <Footer />
    </div>
  );
};

export default BpmList;
