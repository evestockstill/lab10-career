require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Trip = require('../lib/models/Trip');
const Itinerary = require('../lib/models/Itinerary');

describe('itinerary routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let trip;
  let itinerary;
  beforeEach(async() => {
    trip = await Trip.create({
      name: 'Paris',
      details: 
        { time: 2, tripLength: 'weeks' },
      notes: 
        'in Paris to visit friends'
    });
    itinerary = await Itinerary.create({
      tripId: trip._id,
      dateOfItinerary: new Date(),
      notes: 'overnight flight'
    });
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an itinerary', () => {
    return request(app)
      .post('/api/v1/itinerary')
      .send({
        tripId: trip._id,
        dateOfItinerary: Date.now(),
        notes: 'overnight flight',
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tripId: trip._id.toString(),
          dateOfItinerary: expect.any(String),
          notes: 'overnight flight',
          __v: 0
        });
      });
  });

  it('updates an itinerary by id', async() => {
    return request(app)
      .patch(`/api/v1/itinerary/${itinerary._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tripId: trip._id.toString(),
          dateOfItinerary: expect.any(String),
          notes: 'overnight flight',
          __v: 0
        });
      });
  });

  it('deletes an itinerary by id', async() => {
    return request(app)
      .delete(`/api/v1/itinerary/${itinerary._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tripId: trip._id.toString(),
          dateOfItinerary: expect.any(String),
          notes: 'overnight flight',
          __v: 0
        });
      });
  });
});
