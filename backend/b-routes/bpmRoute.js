const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const router = express.Router();
const bpmModel = require('../models/bpmSchema.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
 
 // Route to fetch all customers
 router.get('/getlist', async (req, res) => {
     try {
         // Use the CustomerModel to fetch all customers
         const bpm = await bpmModel.find();
         res.json({ bpm });
     } catch (error) {
         console.error('Error fetching bpm list:', error);
         res.status(500).json({ error: 'Error fetching bpm list' });
     }
 });
 
 router.post('/addsensordata', async (req, res) => {
  try {

    const { bpmReadings, beatAvg, scannedTime } = req.body;

    const sensorData = {
      bpmReadings,
      beatAvg,
      scannedTime, 
      timestamp: new Date(),
    };
    const newBpm = await bpmModel.create(sensorData);
    io.emit('newBpmData', newBpm); // Emit the new BPM data
    res.json(newBpm);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, sex, beatAvg } = req.body;

    // Function to get heart rate status based on age and sex
    const getHeartRateStatus = (age, sex, beatAvg) => {
      let min, max;

      if (sex === 'Male') {
        if (age >= 18 && age <= 25) {
          min = 56; max = 73;
        } else if (age >= 26 && age <= 35) {
          min = 55; max = 74;
        } else if (age >= 36 && age <= 45) {
          min = 57; max = 75;
        } else if (age >= 46 && age <= 55) {
          min = 58; max = 76;
        } else if (age >= 56 && age <= 65) {
          min = 57; max = 75;
        } else if (age > 65) {
          min = 56; max = 73;
        }
      } else if (sex === 'Female') {
        if (age >= 18 && age <= 25) {
          min = 61; max = 78;
        } else if (age >= 26 && age <= 35) {
          min = 60; max = 76;
        } else if (age >= 36 && age <= 45) {
          min = 60; max = 78;
        } else if (age >= 46 && age <= 55) {
          min = 61; max = 77;
        } else if (age >= 56 && age <= 65) {
          min = 60; max = 77;
        } else if (age > 65) {
          min = 60; max = 76;
        }
      }

      if (!min || !max) {
        // Fallback for invalid or out-of-range ages
        if (beatAvg < 60) return 'Slow Heart Rate';
        if (beatAvg >= 60 && beatAvg <= 100) return 'Normal Heart Rate';
        if (beatAvg > 100) return 'Fast Heart Rate';
      }

      if (beatAvg < min) return 'Slow Heart Rate';
      if (beatAvg > max) return 'Fast Heart Rate';
      return 'Normal Heart Rate';
    };

    const beatStatus = getHeartRateStatus(age, sex, beatAvg);

    // Find the BPM data by ID and update the name, age, sex, and beatStatus fields
    const updatedBpm = await bpmModel.findByIdAndUpdate(id, { name, age, sex, beatStatus }, { new: true });

    if (!updatedBpm) {
      return res.status(404).json({ message: "BPM data not found" });
    }

    res.json(updatedBpm);
  } catch (error) {
    console.error('Error updating BPM data:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

   
module.exports = router;
