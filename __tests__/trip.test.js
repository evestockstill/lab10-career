require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Trip = require('../lib/models/Trip');
const Itinerary = require('../lib/models/Itinerary');

describe('trip routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let trip;
  let itineraries;
  beforeEach(async() => {
    trip = await Trip.create({
      name: 'Paris',
      details: 
        { time: 2, tripLength: 'weeks' },
      notes: 
        'overnight flight'
    });

    itineraries = await Itinerary.create([
      {
        tripId: trip._id,
        dateOfItinerary: new Date(),
        notes: 'overnight flight'
      }
    ]);
  });
  afterAll(() => {
    return mongoose.connection.close();
  });
  it('creates a trip', () => {
    return request(app)
      .post('/api/v1/trips')
      .send({
        name: 'Paris',
        details: 
          { time: 2, tripLength: 'weeks' },
        notes: 
          'overnight flight'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paris',
          details: 
            { _id: expect.any(String), time: 2, tripLength: 'weeks' },
          notes: 
            'overnight flight',
          __v: 0
        });
      });
  });

  it('gets all trips', async() => {
    const trips = await Trip.create([
      { name: 'Paris' },
      { name: 'France' },
      { name: 'Mexico' }
    ]);

    return request(app)
      .get('/api/v1/trips')
      .then(res => {
        trips.forEach(trip => {
          expect(res.body).toContainEqual({
            _id: trip._id.toString(),
            name: trip.name
          });
        });
      });
  });

  it('gets a trip by id', async() => {
    return request(app)
      .get(`/api/v1/trips/${trip._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paris',
          details: 
            { _id: expect.any(String), time: 2, tripLength: 'weeks' },
          notes: 
            'overnight flight',
          __v: 0
        });
      });
  });
  it('updates a trip by id', async() => {
    return request(app)
      .patch(`/api/v1/trips/${trip._id}`)
      .send({ name: 'Paris' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paris',
          details: 
            { _id: expect.any(String), time: 2, tripLength: 'weeks' },
          notes: 
            'overnight flight',
          __v: 0
        });
      });
  });

  it('deletes a trip by id', async() => {
    return request(app)
      .delete(`/api/v1/trips/${trip._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Paris',
          details: 
            { _id: expect.any(String), time: 2, tripLength: 'weeks' },
          notes: 
            'overnight flight',
          __v: 0
        });

        return Itinerary.find();
      })
      .then(itineraries => {
        expect(itineraries).toHaveLength(0);
      });
  });
});
