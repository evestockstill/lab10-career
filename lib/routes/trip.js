const { Router } = require('express');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');


module.exports = Router()

  .get('/', async(req, res, next) => {
    let tripQuery = {};
    if(req.query.details) {
      tripQuery = { 'details.name': req.query.details };
    }
    Trip
      .find(tripQuery)
      .select({ name: true })
      .then(trips => res.send(trips));
  })
  .post('/', (req, res) => {
    Trip
      .create(req.body)
      .then(trip => res.send(trip));
  })
  .get('/:id', (req, res) => {
    Trip
      .findById(req.params.id)
      .populate('itineraries')
      .then(trip => {
        res.send(trip);
      });
  })
  .patch('/:id', (req, res) => {
    Trip
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(trip => res.send(trip));
  })

  .delete('/:id', (req, res) => {
    Promise.all([
      Trip.findByIdAndDelete(req.params.id),
      Itinerary.deleteMany({ tripId: req.params.id })
    ])
      .then(([trip]) => res.send(trip));
  });
