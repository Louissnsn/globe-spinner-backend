require("dotenv").config();
require("../../connection");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const AccommodationBase = require("../../models/accommodation/accommodationBases");
const AccommodationSlot = require("../../models/accommodation/accommodationSlots");
const AccommodationExtra = require("../../models/accommodation/accommodationExtras");

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

// Fetch all accommodations data from the database
Promise.all([
  AccommodationBase.find(),
  AccommodationSlot.find(),
  AccommodationExtra.find(),
])
  .then(([bases, slots, extras]) => {
    // Assign random possible extras to each accommodation base
    bases.forEach((base) => {
      const randomExtras = getRandomSubset(extras, 5);
      const extraIds = randomExtras.map((extra) => new ObjectId(extra._id));
      base.possibleExtras = extraIds;
      base.save();
    });

    // Assign a random accommodation base to each slot
    slots.forEach((slot) => {
      const randomBase = bases[getRandomIndex(bases.length)];
      slot.accommodationBase = new ObjectId(randomBase._id);
      slot.save();
    });
  })
  .catch((error) => {
    console.error("Error fetching or saving accommodations data:", error);
  })
  .finally(() => {
    mongoose.connection.close(); // Close the database connection
  });
