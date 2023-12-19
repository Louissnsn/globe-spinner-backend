require("./database/connection");

const AccommodationRoom = require("./database/models/accommodation/accommodationRooms");
const AccommodationBase = require("./database/models/accommodation/accommodationBases");

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRoomNumber() {
  const randomNbr = generateRandomNumber(1, 99);
  const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  const roomNbr = randomNbr.toString().padStart(2, "0") + randomLetter;

  return roomNbr;
}

const generateAccommodationRoom = async () => {
  const accommodationBases = await AccommodationBase.find();

  for (let i = 0; i < accommodationBases.length; i++) {
    if (accommodationBases[i].type === "airbnb") {
      for (let j = 0; j < generateRandomNumber(1, 3); j++) {
        const newRoom = new AccommodationRoom({
          accommodationBase: accommodationBases[i]._id,
          roomNb: "N/A",
          bookings: [],
          basePricePerNight: generateRandomNumber(10, 50),
          variations: [],
          maxNbPeople: generateRandomNumber(2, 6),
        });
        await newRoom.save();
      }
    } else {
      for (let j = 0; j < generateRandomNumber(50, 200); j++) {
        const newRoom = new AccommodationRoom({
          accommodationBase: accommodationBases[i]._id,
          roomNb: generateRoomNumber(),
          bookings: [],
          basePricePerNight: generateRandomNumber(10, 50),
          variations: [],
          maxNbPeople: generateRandomNumber(2, 6),
        });
        await newRoom.save();
      }
    }
  }
  return console.log("end");
};

generateAccommodationRoom();
