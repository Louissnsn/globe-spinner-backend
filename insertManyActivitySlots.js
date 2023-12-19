require("./database/connection");

const moment = require("moment");
const ActivitySlot = require("./database/models/activities/activitySlots");
const ActivityBase = require("./database/models/activities/activityBases");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function generateRandomDateRange() {
  // Define start date range
  const startDate = moment("19/12/2023", "DD-MM-YYYY");
  const endDate = moment("30/03/2024", "DD-MM-YYYY");

  // Calculate time difference in milliseconds
  const timeDifference = endDate.diff(startDate);

  // Generate a random number within the time difference
  const randomTime = Math.floor(Math.random() * timeDifference);

  // Add the random time difference to the start date
  const randomStartDate = startDate.clone().add(randomTime, "milliseconds");

  // Generate a random duration between 1 and 3 hours
  const randomDuration = Math.random() * 3 + 1;

  // Calculate end date by adding the random duration to the start date
  const randomEndDate = randomStartDate.clone().add(randomDuration, "hours");

  return {
    startDate: randomStartDate.toDate(),
    endDate: randomEndDate.toDate(),
  };
}

const generateActivitySlot = async () => {
  const activityBases = await ActivityBase.find();
  let docs = [];

  for (let i = 0; i < 100_000; i++) {
    const { startDate, endDate } = generateRandomDateRange();
    const randomIndex = Math.floor(Math.random() * activityBases.length);
    const randomBase = activityBases[randomIndex]._id;

    const obj = {
      activityBase: randomBase,
      startTime: startDate,
      endTime: endDate,
      maxNbPeople: random(10, 35).toFixed(0),
      remainingPlaces: random(0, 35).toFixed(0),
      price: random(10, 53).toFixed(2),
    };
    docs.push(obj);
  }
  return docs;
};

generateActivitySlot().then((docs) => {
  ActivitySlot.insertMany(docs)
    .then((docs) => console.log(`Inserted ${docs.length}`))
    .catch((err) => console.error(err));
});
