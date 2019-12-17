const mongoose = require('mongoose');
const schema = new mongoose.Schema({

  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  dateOfItinerary: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    require: false
  }
});
schema.virtual('day')
  .get(function() {
    return this.dateOfItinerary.getDate();
  })
  .set(function(day) {
    return this.dateOfItinerary.setDate(day);
  });

schema.virtual('month')
  .get(function() {
    return this.dateOfItinerary.getMonth() + 1;
  })
  .set(function(month) {
    this.dateOfItinerary.setMonth(month - 1);
  });
schema.virtual('year')
  .get(function() {
    return this.dateOfItinerary.getFullYear();
  })
  .set(function(year) {
    this.dateOfItinerary.setYear(year);
  });

module.exports = mongoose.model('Itinerary', schema);
