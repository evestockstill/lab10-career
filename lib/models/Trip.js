const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

schema.virtual('itinerary', {
  ref: 'ItineraryItem',
  localField: '_id',
  foreignField: 'trip'
});

schema.statics.findByIdWithWeather = async function(id) {
  const trip = await this
    .findById(id)
    .populate('itinerary');

  const itinerary = await Promise.all(trip.itinerary.map(item => item.getWeather()));

  return {
    ...trip.toJSON(),
    itinerary
  };
};

module.exports = mongoose.model('Trip', schema);
