require("dotenv").config();
require("./database/connection");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const TransportBase = require("./database/models/transport/transportBases");
const TransportSlot = require("./database/models/transport/transportSlots");

const Destination = require("./database/models/destinations");

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startDateString, endDateString) {
  const momentStart = moment(startDateString, "YYYY-MM-DD");
  const momentEnd = moment(endDateString, "YYYY-MM-DD");

  const startMillis = momentStart.valueOf();
  const endMillis = momentEnd.valueOf();
  const randomMillis = startMillis + Math.random() * (endMillis - startMillis);

  const randomMoment = moment(randomMillis);
  const date = randomMoment.toDate();
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

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

const pushMany = async () => {
  const documents = [];
  const transportBases = await TransportBase.find();
  const destinations = await Destination.find();

  for (let i = 0; i < 150_000; i++) {
    const randomIndex = Math.floor(Math.random() * transportBases.length);
    const randomTransportBase = transportBases[randomIndex];
    const transportType = randomTransportBase.type;

    const departureDestIndex = Math.floor(Math.random() * destinations.length);
    const departureDest = destinations[departureDestIndex];

    //ensure arrival place is different from departure place
    let arrivalDestIndex = departureDest;
    let arrivalDest;
    while (arrivalDestIndex == departureDest) {
      arrivalDestIndex = Math.floor(Math.random() * destinations.length);
      arrivalDest = destinations[arrivalDestIndex];
    }

    const latDep = departureDest.centerLocation.latitude;
    const longDep = departureDest.centerLocation.longitude;
    const latArr = arrivalDest.centerLocation.latitude;
    const longArr = arrivalDest.centerLocation.longitude;

    const distance = calculateDistance(latDep, longDep, latArr, longArr);
    //console.log('distance: ', distance);

    const departureDate = getRandomDate("2023-12-12", "2024-03-30");
    //const duration = getRandomValue(20, 500); // entre 20 min et 500 min

    let timeMultiplier;
    if (transportType === "Airplane") {
      timeMultiplier = 0.05;
    } else if (transportType === "Train") {
      timeMultiplier = 0.2;
    } else if (transportType === "Coach") {
      timeMultiplier = 0.5;
    }

    const duration = distance * timeMultiplier;
    const arrivalDate = moment(departureDate.toISOString())
      .add(duration, "minutes")
      .toDate();

    let priceMultiplier;
    if (transportType === "Airplane") {
      priceMultiplier = 0.05;
    } else if (transportType === "Train") {
      priceMultiplier = 0.03;
    } else if (transportType === "Coach") {
      priceMultiplier = 0.01;
    }

    //const secondClassPrice = getRandomValue(10, 100);
    const secondClassPrice = distance * priceMultiplier;
    const firstClassPrice = secondClassPrice * 1.2;

    const obj = {
      transportBase: new ObjectId(randomTransportBase._id),
      departure: {
        place: departureDest._id,
        date: departureDate,
      },
      arrival: {
        place: arrivalDest._id,
        date: arrivalDate,
      },
      firstClass: {
        price: firstClassPrice,
        nbRemainingSeats: Math.floor(Math.random() * 6),
      },
      secondClass: {
        price: secondClassPrice,
        nbRemainingSeats: Math.floor(Math.random() * 4),
      },
    };

    documents.push(obj);
  }

  return documents;
};

pushMany().then((docs) => {
  TransportSlot.insertMany(docs)
    .then((docs) => console.log(`Inserted ${docs.length}`))
    .catch((err) => console.error(err));
});
