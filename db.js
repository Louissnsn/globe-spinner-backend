require('dotenv').config();
require('./database/connection');

// accommodation:
const { generateAccommodationBase, clearAccommodationBases } = require(
  './database/generate/accommodation/accommodationBase');
const { generateAccommodationSlot, clearAccommodationSlots } = require(
  './database/generate/accommodation/accommodationSlot');
const { generateAccommodationExtra, clearAccommodationExtras } = require(
  './database/generate/accommodation/accommodationExtra');

// acitivties:
const { generateActivityBase, clearActivityBases } = require(
  './database/generate/activities/activityBase');
const { generateActivitySlot, clearActivitySlots } = require(
  './database/generate/activities/activitySlot');
const { generateActivityExtra, clearActivityExtras } = require(
  './database/generate/activities/activityExtra');


const args = process.argv.slice(2);

const [collectionName, action, number] = args;

//console.log(collectionName, action, number);

if (action === 'create'){
  const creations = [];

  for (let i = 0; i < number; i++) {
    let creation;

    if (collectionName === 'accommodation_bases')
      creation = generateAccommodationBase();
    else if (collectionName === 'accommodation_extras')
      creation = generateAccommodationExtra();
    else if (collectionName === 'accommodation_slots')
      creation = generateAccommodationSlot();

    if (collectionName === 'activity_bases')
      creation = generateActivityBase();
    else if (collectionName === 'activity_extras')
      creation = generateActivityExtra();
    else if (collectionName === 'activity_slots')
      creation = generateActivitySlot();

    if (creation)
      creations.push(creation);
  }
  if (creations.length > 0)
    Promise.all(creations).then(e => console.log(`created ${e.length} ${collectionName}`));
}

else if (action === 'clear'){
  if (collectionName === 'accommodation_bases')
    clearAccommodationBases();
  else if (collectionName === 'accommodation_extras')
    clearAccommodationExtras();
  else if (collectionName === 'accommodation_slots')
    clearAccommodationSlots();
}

