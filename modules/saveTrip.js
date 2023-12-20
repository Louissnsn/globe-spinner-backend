const Trip = require("../database/models/trips");
const User = require("../database/models/users");
// const { tripA, tripB } = require("../exampleTrips");
// let trips = [tripA, tripB];
const { getTrips } = require('../routes/trips');

async function saveTrip(req) {
  const selectedTripIndex = Number(req.params.tripIndex);
  const userToken = req.params.userToken;
  
  const trips = getTrips();
  console.log('###################', trips);
  const user = await User.find({token: userToken});
  const tripForDB = getFormattedTripForDB(trips[selectedTripIndex], user._id);
  const newTrip = new Trip(tripForDB);
  const savedTrip = await newTrip.save();
  return { userToken, savedTrip };
}

function getFormattedTripForDB(trip, userId){

  const activitiesDB = trip.activities.map((act) => {
    return ({
      activitySlot: act._id,  // activity slot id
      activityExtras: [],  // no extras for now
    });
  });

  return (
    {
      user: userId,
      nbOfTravelers: trip.numberOfTravelers,
      destination: trip.destination.id,
      outboundJourney: {
        transportSlot: 'the_slot_id', // put transport slot id here
        transportExtras: [],  // no extras for now
        seats: { from: 'seatNumber', to: 'seatNumber'}, // put seat numbers here
        class: trip.outboundJourney.class,
      },
      inboundJourney: {
        transportSlot: 'the_slot_id', // put transport slot id here
        transportExtras: [],  // no extras for now
        seats: { from: 'seatNumber', to: 'seatNumber'}, // put seat numbers here
        class: trip.inboundJourney.class,
      },
      accommodation: {
        accommodationRoom: trip.accommodation._id, // accommodation room id
        accommodationExtras: trip.accommodation.accommodationBase.possibleExtras,
      },
      activities: activitiesDB,
      totalPaidAmount: trip.total,
    }
  );
}

async function getSavedTripById(tripId) {
  const savedTrip = await Trip.findById(tripId);
  return savedTrip;
}


module.exports = { saveTrip, getFormattedTripForDB };


