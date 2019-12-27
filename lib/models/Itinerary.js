const mongoose = require('mongoose');
const { getWeather } = require('../services/weather');

const schema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  woeid: String,
  latitude: Number,
  longitude: Number
});

schema.methods.getWeather = function() {
  return getWeather(this.startDate, this.woeid)
    .then(weather => ({
      ...this.toJSON(),
      temp: weather && weather.min_temp
    }));
};

module.exports = mongoose.model('ItineraryItem', schema);
