const calculateDistance = require("./calculateDistance");

const getDestination = async (collection, filters) => {
  const destinations = await collection.find();

  const locations = destinations
    .map((e) => {
      return {
        id: e._id,
        name: e.name,
        country: e.country,
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
  return {
    destinationIndex,
    destination,
    departureLocation,
    locations,
    destinations,
  };
};

module.exports = getDestination;
