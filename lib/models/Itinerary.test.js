/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Itinerary = require('./Itinerary');


describe('Itinerary model', () => {
  it('has a required tripId', () => {
    const itinerary = new Itinerary();
    const { errors } = itinerary.validateSync();

    expect(errors.tripId.message).toEqual('Path `tripId` is required.');
  });

  it('has a required dateOfItinerary', () => {
    const itinerary = new Itinerary();
    const { errors } = itinerary.validateSync();

    expect(errors.dateOfItinerary.message).toEqual('Path `dateOfItinerary` is required.');
  });

  it('has a day get virtual', () => {
    const itinerary = new Itinerary({
      dateOfItinerary: new Date('2019-12-10T00:00:00')
    });
    expect(itinerary.day).toEqual(10);
  });
  it('has a day set', () => {
    const itinerary = new Itinerary({
      dateOfItinerary: new Date('2019-12-10T00:00:00')
    });
    itinerary.day = 11;
    expect(itinerary.dateOfItinerary).toEqual(new Date('2019-12-11T00:00:00'));
  });
  it('has a month get', () => {
    const itinerary = new Itinerary({
      dateOfItinerary: new Date('2019-10-11T00:00:00')
    });

    expect(itinerary.month).toEqual(10);
  });

  it('has a month set', () => {
    const itinerary = new Itinerary({
      dateOfItinerary: new Date('2019-12-11T00:00:00')
    });
    itinerary.month = 10;
    expect(itinerary.dateOfItinerary).toEqual(new Date('2019-10-11T00:00:00'));
  });
  it('has a year get', () => {
    const itinerary = new Itinerary({
      dateOfItinerary: new Date('2010-12-11T00:00:00')
    });

    expect(itinerary.year).toEqual(2010);
  });

  it('has a year set', () => {
    const itinerary = new Itinerary({
      dateOfItinerary: new Date('2019-12-11T00:00:00')
    });
    itinerary.year = 2018;
    expect(itinerary.dateOfItinerary).toEqual(new Date('2018-12-11T00:00:00'));
  });
});
