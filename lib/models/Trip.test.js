const mongoose = require('mongoose');
const Trip = require('./Trip');

describe('Trip model', () => {
  it('has a required name', () => {
    const trip = new Trip();
    const { errors } = trip.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a name and notes field', () => {
    const trip = new Trip({
      name: 'Paris',
      details:
        { _id: expect.any(mongoose.Types.ObjectId), time: 2, tripLength: 'weeks' },
      notes: 
        'in Paris to visit friends'
    });
    expect(trip.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Paris',
      details: 
        { _id: expect.any(mongoose.Types.ObjectId), time: 2, tripLength: 'weeks' },
      notes:
        'in Paris to visit friends'
    });
  });
});
