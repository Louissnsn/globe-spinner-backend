require("dotenv").config();
require("./database/connection");

// accommodation:
const {
  generateAccommodationBase,
  clearAccommodationBases,
} = require("./database/generate/accommodation/accommodationBase");
const {
  generateAccommodationRoom,
  clearAccommodationRooms,
} = require("./database/generate/accommodation/accommodationRoom");
const {
  generateAccommodationExtra,
  clearAccommodationExtras,
} = require("./database/generate/accommodation/accommodationExtra");

// acitivties:
const {
  generateActivityBase,
  clearActivityBases,
} = require("./database/generate/activities/activityBase");
const {
  generateActivitySlot,
  clearActivitySlots,
} = require("./database/generate/activities/activitySlot");
const {
  generateActivityExtra,
  clearActivityExtras,
} = require("./database/generate/activities/activityExtra");

// transports:
const {
  generateTransportBase,
  clearTransportBases,
} = require("./database/generate/transport/transportBase");
const {
  generateTransportSlot,
  clearTransportSlots,
} = require("./database/generate/transport/transportSlot");
const {
  generateTransportExtra,
  clearTransportExtras,
} = require("./database/generate/transport/transportExtra");

const args = process.argv.slice(2);

const [collectionName, action, number] = args;

//console.log(collectionName, action, number);

const logDeletedMsg = (q) =>
  console.log(`deleted ${q.deletedCount} ${collectionName}`);

if (action === "create") {
  const creations = [];

  for (let i = 0; i < number; i++) {
    let creation;

    if (collectionName === "accommodation_bases")
      creation = generateAccommodationBase();
    else if (collectionName === "accommodation_extras")
      creation = generateAccommodationExtra();
    else if (collectionName === "accommodation_rooms")
      creation = generateAccommodationRoom();

    if (collectionName === "activity_bases") 
      creation = generateActivityBase();
    else if (collectionName === "activity_extras")
      creation = generateActivityExtra();
    else if (collectionName === "activity_slots")
      creation = generateActivitySlot();

    if (collectionName === "transport_bases")
      creation = generateTransportBase();
    else if (collectionName === "transport_extras")
      creation = generateTransportExtra();
    else if (collectionName === "transport_slots")
      creation = generateTransportSlot();

    if (creation) creations.push(creation);
  }
  if (creations.length > 0)
    Promise.all(creations).then((e) =>
      console.log(`created ${e.length} ${collectionName}`)
    );
} 
else if (action === "clear") {
  if (collectionName === "accommodation_bases")
    clearAccommodationBases().then((q) => logDeletedMsg(q));
  else if (collectionName === "accommodation_extras")
    clearAccommodationExtras().then((q) => logDeletedMsg(q));
  else if (collectionName === "accommodation_rooms")
    clearAccommodationRooms().then((q) => logDeletedMsg(q));

  if (collectionName === "activity_bases")
    clearActivityBases().then((q) => logDeletedMsg(q));
  else if (collectionName === "activity_extras")
    clearActivityExtras().then((q) => logDeletedMsg(q));
  else if (collectionName === "activity_slots")
    clearActivitySlots().then((q) => logDeletedMsg(q));

  if (collectionName === "transport_bases")
    clearTransportBases().then((q) => logDeletedMsg(q));
  else if (collectionName === "transport_extras")
    clearTransportExtras().then((q) => logDeletedMsg(q));
  else if (collectionName === "transport_slots")
    clearTransportSlots().then((q) => logDeletedMsg(q));
}
