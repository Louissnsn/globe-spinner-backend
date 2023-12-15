const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
require("./transportBases");
require("../destinations");

const transportSlotSchema = new mongoose.Schema({
  transportBase: { type: ObjectId, ref: "transport_bases" },
  departure: {
    place: { type: ObjectId, ref: "destinations" },
    date: Date,
  },
  arrival: {
    place: { type: ObjectId, ref: "destinations" },
    date: Date,
  },
  firstClass: {
    price: Number,
    nbRemainingSeats: Number,
  },
  secondClass: {
    price: Number,
    nbRemainingSeats: Number,
  },
});

const TransportSlot = mongoose.model("transport_slots", transportSlotSchema);

module.exports = TransportSlot;
