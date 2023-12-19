require("dotenv").config();
require("../../connection");

const AccommodationRoom = require("../../models/accommodation/accommodationRooms");
const AccommodationBase = require("../../models/accommodation/accommodationBases");
function generateRoomNumber() {
  const randomNbr = Math.floor(Math.random() * 99) + 1;
  const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  const roomNbr = randomNbr.toString().padStart(2, "0") + randomLetter;

  return roomNbr;
}

const generateAccommodationRoom = async () => {
  const accommodationBases = await AccommodationBase.find();
  const randomNbrToSix = Math.floor(Math.random() * 6) + 1;
  const randomNbrToThree = Math.floor(Math.random() * 3) + 1;
  const randomNbr = Math.floor(Math.random() * 99) + 1;

  for (let i = 0; i < accommodationBases.length; i++) {
    if (accommodationBases[i].type === "airbnb") {
      for (let i = 0; i < randomNbrToThree; i++) {
        const newRoom = new AccommodationRoom({
          accommodationBase: accommodationBases[i]._id,
          roomNb: "N/A",
          bookings: [],
          maxNbPeople: randomNbrToSix,
        });
        await newRoom.save();
      }
    } else {
      for (let i = 0; i < randomNbr; i++) {
        const newRoom = new AccommodationRoom({
          accommodationBase: accommodationBases[i]._id,
          roomNb: generateRoomNumber(),
          bookings: [],
          maxNbPeople: randomNbrToSix,
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
