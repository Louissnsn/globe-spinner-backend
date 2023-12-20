const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
require("./transport/transportSlots");
require("./transport/transportExtras");
require("./users");
require("./accommodation/accommodationRooms");
require("./accommodation/accommodationExtras");
require("./activities/activitySlots");
require("./activities/activityExtras");

const journeySchema = new mongoose.Schema({
  transportSlot: { type: ObjectId, ref: "transport_slots" },
  transportExtras: [{ type: ObjectId, ref: "transport_extras" }],
  seats: {from: Number, to: Number}, // ex: {from: 14, to: 16}  (if 3 travelers)
  class: String, // ex: "second"
});

const tripSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "users" },
  nbOfTravelers: Number,
  destination: { type: ObjectId, ref: "destinations" },
  outboundJourney: journeySchema, // l'aller
  inboundJourney: journeySchema, // le retour
  accommodation: {
    accommodationRoom: { type: ObjectId, ref: "accommodation_rooms" },
    accommodationExtras: [{ type: ObjectId, ref: "accommodation_extras" }],
  },
  activities: [
    {
      activitySlot: { type: ObjectId, ref: "activity_slots" },
      activityExtras: [{ type: ObjectId, ref: "activity_extras" }],
    },
  ],
  totalPaidAmount: Number,
});

const Trip = mongoose.model("trips", tripSchema);

module.exports = Trip;
