const { getWOEID } = require('../services/weather');

module.exports = (req, res, next) => {
  getWOEID(req.body.latitude, req.body.longitude)
    .then(woeid => {
      req.woeid = woeid;
      next();
    })
    .catch(next);
};
