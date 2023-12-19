const Trip = require("../database/models/trips");
// const { tripA, tripB } = require("../exampleTrips");
// let trips = [tripA, tripB];
const { getTrips } = require('../routes/trips');

async function saveTrip(req) {
  const selectedTripIndex = Number(req.params.tripIndex);
  const userToken = req.params.userToken;
  
  const trips = getTrips();
  console.log('###################', trips);
  const newTrip = new Trip(trips[selectedTripIndex]);
  const savedTrip = await newTrip.save();
  return { userToken, savedTrip };
}

async function getSavedTripById(tripId) {
  const savedTrip = await Trip.findById(tripId);
  return savedTrip;
}


module.exports = { saveTrip };


