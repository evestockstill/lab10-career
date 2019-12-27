require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Trip = require('../lib/models/Trip');
const ItineraryItem = require('../lib/models/Itinerary');

jest.mock('../lib/services/weather.js', () => ({
  getWOEID() {
    return Promise.resolve('56789');
  },
  getWeather() {
    return Promise.resolve({
      min_temp: 75
    });
  }
}));

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let trip;
  let itineraryItem;
  beforeEach(async() => {
    trip = await Trip.create({
      name: 'paris summer 2020'
    });

    itineraryItem = await ItineraryItem.create({
      trip: trip._id,
      startDate: new Date('2020-07-21'),
      endDate: new Date('2020-07-22'),
      woeid: '2487956',
      name: 'wine tasting'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a trip', () => {
    return request(app)
      .post('/api/v1/trips')
      .send({ name: 'Mexico 2022' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Mexico 2022',
          __v: 0
        });
      });
  });

  it('gets a trip by id', () => {
    return request(app)
      .get(`/api/v1/trips/${trip.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: trip.id,
          name: 'paris summer 2020',
          itinerary: [{
            _id: itineraryItem.id,
            trip: trip.id,
            startDate: itineraryItem.startDate.toISOString(),
            endDate: itineraryItem.endDate.toISOString(),
            temp: 75,
            name: 'wine tasting',
            woeid: '2487956',
            __v: 0
          }],
          __v: 0
        });
      });
  });

  it('gets all trips', () => {
    return request(app)
      .get('/api/v1/trips')
      .then(res => {
        expect(res.body).toEqual([JSON.parse(JSON.stringify(trip))]);
      });
  });

  it('updates a trip', () => {
    return request(app)
      .patch(`/api/v1/trips/${trip.id}`)
      .send({ name: 'Minnesota Fall 2021' })
      .then(res => {
        expect(res.body.name).toEqual('Minnesota Fall 2021');
      });
  });

  it('deletes a trip', () => {
    return request(app)
      .delete(`/api/v1/trips/${trip.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: trip.id,
          name: 'paris summer 2020',
          __v: 0
        });
      });
  });

  it('can add an itinerary item', () => {
    return request(app)
      .post(`/api/v1/trips/${trip.id}/item`)
      .send({
        startDate: new Date('2021-07-26'),
        endDate: new Date('2021-07-27'),
        name: 'Go Swimming',
        latitude: 35.733333,
        longitude: -100.5555
      })
      .then(res => {
        expect(res.body.itinerary).toContainEqual({
          _id: expect.any(String),
          trip: trip.id,
          startDate: '2021-07-26T00:00:00.000Z',
          endDate: '2021-07-27T00:00:00.000Z',
          name: 'Go Swimming',
          latitude: 35.733333,
          longitude: -100.5555,
          woeid: '56789',
          __v: 0
        });
      });
  });

  it('can delete an itinerary item', () => {
    return request(app)
      .delete(`/api/v1/trips/${trip.id}/item/${itineraryItem.id}`)
      .then(res => {
        expect(res.body.itinerary).toHaveLength(0);
      });
  });
});
