const mongoose = require('mongoose');
const { type } = require('os');

// Define the schema for the bpm data with additional name and age fields
const bpmSchema = new mongoose.Schema({
  name:{
    type: String
  },

  age:{
    type:Number
  },

  sex: {
    type: String,
    enum: ['Male', 'Female']
  },
  
  bpmReadings: [
    {
      beats: {
        type: Number,
        required: true
      },

      bpmtime: {
        type: Number,
        required: false,
      }
    }
  ],
  beatAvg: {
    type: Number,
    required: true,
  },
  scannedTime:{
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  beatStatus:{
    type: String,
  }


});

// Create the model from the schema
const bpmModel = mongoose.model('bpm', bpmSchema);

module.exports = bpmModel;
