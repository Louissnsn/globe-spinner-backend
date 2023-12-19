require("dotenv").config();
require("../../connection");

const AccommodationRoom = require("../../models/accommodation/accommodationRooms");
const AccommodationBase = require("../../models/accommodation/accommodationBases");

function generateRandomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}
function generateRoomNumber() {
  const randomNbr = generateRandomNumber(99);
  const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  const roomNbr = randomNbr.toString().padStart(2, "0") + randomLetter;

  return roomNbr;
}

const generateAccommodationRoom = async () => {
  const accommodationBases = await AccommodationBase.find();

  for (let i = 0; i < accommodationBases.length; i++) {
    if (accommodationBases[i].type === "airbnb") {
      for (let i = 0; i < generateRandomNumber(3); i++) {
        const newRoom = new AccommodationRoom({
          accommodationBase: accommodationBases[i]._id,
          roomNb: "N/A",
          bookings: [],
          maxNbPeople: generateRandomNumber(6),
        });
        await newRoom.save();
      }
    } else {
      for (let i = 0; i < generateRandomNumber(99); i++) {
        const newRoom = new AccommodationRoom({
          accommodationBase: accommodationBases[i]._id,
          roomNb: generateRoomNumber(),
          bookings: [],
          maxNbPeople: generateRandomNumber(6),
        });
        await newRoom.save();
      }
    }
  }
  return console.log("end");
};

//generateAccommodationRoom();

const clearAccommodationRooms = () => {
  return AccommodationRoom.deleteMany();
};

module.exports = {
  generateAccommodationRoom,
  clearAccommodationRooms,
};
