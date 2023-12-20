require("./database/connection");
const Destination = require("./database/models/destinations");
const ActivityBase = require("./database/models/activities/activityBases");

function generateRandomCoordinates(centerLat, centerLon, radiusInKilometers) {
  const earthRadius = 6371; // Earth radius in kilometers

  // Generate a random distance within the radius
  const randomDistance = Math.random() * radiusInKilometers;

  // Calculate the new coordinates
  const newLat = centerLat + (randomDistance / earthRadius) * (180 / Math.PI);
  const newLon =
    centerLon +
    ((randomDistance / earthRadius) * (180 / Math.PI)) /
      Math.cos(centerLat * (Math.PI / 180));

  return { newLat, newLon };
}
const generateActivities = async () => {
  const docs = [];

  const activities = require("./database/fakeData/activities/activityBases.json");
  const destinations = await Destination.find();

  for (let destination of destinations) {
    const lat = destination.centerLocation.latitude;
    const lon = destination.centerLocation.longitude;
    for (let activity of activities) {
      const { newLat, newLon } = generateRandomCoordinates(lat, lon, 10);
      const obj = {
        name: activity.name,
        organisationName: activity.organisationName,
        description: activity.description,
        location: {
          latitude: newLat,
          longitude: newLon,
        },
        activityTags: activity.activityTags,
        possibleExtras: activity.possibleExtras,
      };
      docs.push(obj);
    }
  }
  return docs;
};

generateActivities().then((docs) => {
  ActivityBase.insertMany(docs)
    .then((docs) => console.log(`Inserted ${docs.length}`))
    .catch((err) => console.error(err));
});
