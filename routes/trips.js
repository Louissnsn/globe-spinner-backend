var express = require("express");
var router = express.Router();

//const AccommodationSlot = require("../database/models/accommodationRooms");

const moment = require("moment");

const Trip = require("../database/models/trips");
const AccommodationRooms = require("../database/models/accommodation/accommodationRooms");
const TransportSlot = require("../database/models/transport/transportSlots");
const Destination = require("../database/models/destinations");
const { tripA, tripB } = require("../exampleTrips");
let trips = [tripA, tripB];

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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance.toFixed(2);
};

//
router.post("/generate", async (req, res) => {
  const filters = req.body;
  //Cherche le lieu de départ (aéroport, gare, etc.) le plus proche de l'adresse de l'utilisateur renseignée + de générer aléatoirement la destination.
  const data = await Destination.find();

  const locations = data
    .map((e) => {
      return {
        id: e._id,
        name: e.name,
        lat: e.centerLocation.latitude,
        lon: e.centerLocation.longitude,
        distance: calculateDistance(
          e.centerLocation.latitude,
          e.centerLocation.longitude,
          filters.lat,
          filters.lon
        ),
      };
    })
    .sort((a, b) => a.distance - b.distance); // trie du plus proche au plus lointain
  const destinationIndex = Math.floor(Math.random() * locations.length) + 1;
  const destination = locations[destinationIndex];
  const departureLocation = locations[0];
  // ----------- fin de la première section -----------

  // RECUPERATION ALLERS RETOURS

  const findTransportSlots = async (
    departurePlace,
    arrivalPlace,
    departureDateRange
  ) => {
    return await TransportSlot.find({
      "departure.place": departurePlace,
      "arrival.place": arrivalPlace,
      "departure.date": {
        $gte: departureDateRange.min,
        $lte: departureDateRange.max,
      },
    });
  };

  const departureDateRangeOutbound = {
    min: moment(filters.departureMinOutbound).toDate(),
    max: moment(filters.departureMaxOutbound).toDate(),
  };

  const departureDateRangeInbound = {
    min: moment(filters.departureMinInbound).toDate(),
    max: moment(filters.departureMaxInbound).toDate(),
  };

  const outboundJourneys = await findTransportSlots(
    departureLocation.id,
    destination.id,
    departureDateRangeOutbound
  );

  const inboundJourneys = await findTransportSlots(
    destination.id,
    departureLocation.id,
    departureDateRangeInbound
  );

  const totalBudget = filters.budget;
  const validCombinations = [];
  const classes = ["firstClass", "secondClass"];
  // const transportClass = filters.class;

  for (let transportClass of classes) {
    for (let outboundJourney of outboundJourneys) {
      for (let inboundJourney of inboundJourneys) {
        const totalCost =
          outboundJourney[transportClass].price +
          inboundJourney[transportClass].price;

        if (totalCost <= totalBudget / 3) {
          validCombinations.push({
            outboundJourney,
            inboundJourney,
            transportClass,
            totalCost: totalCost.toFixed(2),
          });
        }
      }
    }
  }

  res.json({
    nbrCombinations: validCombinations.length,
    validCombinations,
    nbrOutbound: outboundJourneys.length,
    nbrInbound: inboundJourneys.length,
  });
});

(module.exports = router), { tripA, tripB };
