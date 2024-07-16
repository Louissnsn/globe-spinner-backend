require("dotenv").config();
require("../../connection");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const ActivityBase = require("../../models/activities/activityBases");
const Destination = require("../../models/destinations");

/**
 * Get a random subset of an array with a maximum length.
 * @param {Array} arr - The array to get a subset from.
 * @param {number} maxLength - The maximum length of the subset.
 * @returns {Array} - A random subset of the array.
 */
function getRandomSubset(arr, maxLength) {
  // Shuffle the array
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Get a random length for the subset
  const length = getRandomIndex(maxLength);
  // Return the subset
  return arr.slice(0, length);
}

/**
 * Get a random index within the given max index.
 * @param {number} maxIndex - The maximum index value.
 * @returns {number} - A random index.
 */
function getRandomIndex(maxIndex) {
  return Math.floor(Math.random() * maxIndex);
}

const maxLatitudeDeviation = 0.1; // approx 11 km
const maxLongitudeDeviation = 0.1; // approx 11 km

// Fetch all activities and destinations data from the database
Promise.all([ActivityBase.find(), Destination.find()])
  .then(([bases, destinations]) => {
    // Assign random locations to each activity base
    bases.forEach((base) => {
      const randomLocIndex = getRandomIndex(destinations.length);
      const randomDest = destinations[randomLocIndex];
      const { latitude, longitude } = randomDest.centerLocation;

      // Generate random deviations for latitude and longitude
      const latitudeDeviation =
        (Math.random() - 0.5) * 2 * maxLatitudeDeviation;
      const longitudeDeviation =
        (Math.random() - 0.5) * 2 * maxLongitudeDeviation;

      // Set the base location with deviations
      base.location = {
        latitude: latitude + latitudeDeviation,
        longitude: longitude + longitudeDeviation,
      };

      // Save the updated base location
      base.save();
    });
  })
  .catch((error) => {
    console.error("Error fetching or saving activities data:", error);
  })
  .finally(() => {
    mongoose.connection.close(); // Close the database connection
  });
