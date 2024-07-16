require("dotenv").config();
require("../../connection");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const ActivityBase = require("../../models/activities/activityBases");
const ActivitySlot = require("../../models/activities/activitySlots");
const ActivityExtra = require("../../models/activities/activityExtras");

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

// Fetch all activities data from the database
Promise.all([ActivityBase.find(), ActivitySlot.find(), ActivityExtra.find()])
  .then(([bases, slots, extras]) => {
    // Assign random possible extras to each activity base
    bases.forEach((base) => {
      const randomExtras = getRandomSubset(extras, 5);
      const extraIds = randomExtras.map((extra) => new ObjectId(extra._id));
      base.possibleExtras = extraIds;
      base.save();
    });

    // Assign a random activity base to each slot
    slots.forEach((slot) => {
      const randomBase = bases[getRandomIndex(bases.length)];
      slot.activityBase = new ObjectId(randomBase._id);
      slot.save();
    });
  })
  .catch((error) => {
    console.error("Error fetching or saving activities data:", error);
  })
  .finally(() => {
    mongoose.connection.close(); // Close the database connection
  });
