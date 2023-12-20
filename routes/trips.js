var express = require("express");
var router = express.Router();

const moment = require("moment");
const getDestination = require("../modules/getDestinations");
const findTransportSlots = require("../modules/findTransportSlots");
const findJourney = require("../modules/findJourney");
const findAccommodation = require("../modules/findAccommodation");
const findActivities = require("../modules/findActivities");

const Trip = require("../database/models/trips");
const ActivitySlots = require("../database/models/activities/activitySlots");
const AccommodationRooms = require("../database/models/accommodation/accommodationRooms");
const TransportSlot = require("../database/models/transport/transportSlots");
const Destination = require("../database/models/destinations");
let trips = [];

// ROUTE GET POUR REGENERER ACCOMMODATION
router.get(
  "/newAccommodation/:Locationeparture/:depDate/:arrivDate/:duration/:budget/:people",
  async (req, res) => {
    const { LocationDeparture, depDate, arrivDate, duration, budget, people } =
      req.params;

    const newAccommodation = await findAccommodation(
      LocationDeparture,
      depDate,
      arrivDate,
      duration,
      budget,
      people
    );

    if (!newAccommodation) {
      return res.status(404).json({
        message: "Aucun nouvel hébergement trouvé pour le filtre specifié!",
      });
    }

    const previousAccommodationPrice =
      trips[selectedTripIndex].accommodation.accommodationSlot.price;
    const newAccommodationPrice = newAccommodation.price;

    if (newAccommodationPrice <= previousAccommodationPrice) {
      trips[selectedTripIndex].accommodation = {
        accommodationSlot: newAccommodation,
        accommodationExtras: [],
      };

      const saveTripResponse = saveTrip(req);
    }
  }
);

// Get /newTransport

router.get("/newTransport", async (req, res) => {});

router.post("/generate", async (req, res) => {
  trips = [];
  const filters = req.body;
  const totalBudget = filters.budget;
  const numberOfTravelers = Number(filters.nbrOfTravelers);
  const classes = ["firstClass", "secondClass"];
  const types = filters.types;
  let departureLocation;
  let nbrOfNights;
  let timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout: Operation took too long."));
    }, 30000); // 30 seconds timeout
  });

  console.log([types]);

  for (let i = 0; i <= 1; i++) {
    let destination = null;
    let validCombination = null;
    let accommodation = null;
    let activities = null;

    try {
      await Promise.race([
        (async () => {
          while (!validCombination || !accommodation || !activities) {
            // ----------- GENERATION DE LA DESTINATION -----------

            destination = (await getDestination(Destination, filters))
              .destination;
            departureLocation = (await getDestination(Destination, filters))
              .departureLocation;

            // ----------- GENERATION DES ALLERS RETOURS -----------

            const departureDateRangeOutbound = {
              min: moment(filters.departureMinOutbound).toDate(),
              max: moment(filters.departureMaxOutbound).toDate(),
            };

            const departureDateRangeInbound = {
              min: moment(filters.departureMinInbound).toDate(),
              max: moment(filters.departureMaxInbound).toDate(),
            };
            if (destination) {
              const outboundJourneys = await findTransportSlots(
                TransportSlot,
                departureLocation.id,
                destination.id,
                departureDateRangeOutbound,
                numberOfTravelers,
                types
              );

              const inboundJourneys = await findTransportSlots(
                TransportSlot,
                destination.id,
                departureLocation.id,
                departureDateRangeInbound,
                numberOfTravelers,
                types
              );

              validCombination = findJourney(
                classes,
                outboundJourneys,
                inboundJourneys,
                totalBudget
              );

              // ----------- fin allers retours -----------
              if (validCombination) {
                // ----------- GENERATION DU LOGEMENT -----------

                const arrival = moment
                  .utc(validCombination.outboundJourney.arrival)
                  .startOf("day");
                const departure = moment
                  .utc(validCombination.inboundJourney.departure)
                  .startOf("day");

                nbrOfNights = Math.abs(departure.diff(arrival, "days"));

                accommodation = await findAccommodation(
                  AccommodationRooms,
                  numberOfTravelers,
                  nbrOfNights,
                  validCombination,
                  destination,
                  totalBudget
                );

                // ----------- GENERATION DES ACTIVITES -----------
                if (accommodation) {
                  activities = await findActivities(
                    ActivitySlots,
                    numberOfTravelers,
                    totalBudget,
                    arrival,
                    departure,
                    destination,
                    nbrOfNights
                  );
                }
              }
            }
          }
        })(),
        timeoutPromise,
      ]);
    } catch (error) {
      return res.json({ error: error.message });
    }

    let trip = {
      numberOfTravelers,
      departureLocation,
      destination,
      outboundJourney: validCombination.outboundJourney,
      inboundJourney: validCombination.inboundJourney,
      accommodation: accommodation.accommodation,
      nbrOfNights,
      nbrOfActivities: activities.activities.length,
      activities: activities.activities,
      totalAccommodation: accommodation.totalAccommodation,
      totalTransport: validCombination.totalCost,
      totalActivities: activities.totalActivities,
      total: Number(
        (
          validCombination.totalCost +
          accommodation.totalAccomodation +
          activities.totalActivities
        ).toFixed(2)
      ),
    };
    trips.push(trip);
  }
  return res.json(trips);
});

module.exports = router;
module.exports.getTrips = () => trips;
