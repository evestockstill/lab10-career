const mongoose = require('mongoose');

const tripDetailsSchema = new mongoose.Schema({
  time: {
    type: Number,
    required: true
  },
  tripLength: {
    type: String,
    require: true,
    enum: ['days', 'months', 'weeks']
  }
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  details: tripDetailsSchema,
  notes: String
}, {
  id: false,
  toJSON: { virtuals: true }
});
schema.virtual('itinerary', {
  ref: 'Itinerary',
  localField: '_id',
  foreignField: 'tripId'
});

module.exports = mongoose.model('Trip', schema);
