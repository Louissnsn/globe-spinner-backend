const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
require("./accommodationBases");

const accommodationRoomSchema = new mongoose.Schema({
  accommodationBase: { type: ObjectId, ref: "accommodation_bases" },
  roomNb: String,
  bookings: [{ from: Date, to: Date, totalPaid: Number }],
  basePricePerNight: Number,
  variations: [{ from: Date, to: Date, pricePerNight: Number }],
  maxNbPeople: Number,
});

const AccommodationRoom = mongoose.model(
  "accommodation_rooms",
  accommodationRoomSchema
);

module.exports = AccommodationRoom;
