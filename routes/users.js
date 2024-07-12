var express = require("express");
var router = express.Router();
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// Importing Models and Modules
const User = require("../database/models/users");
const { checkBody } = require("../modules/checkbody");
const { saveTrip } = require("../modules/saveTrip");
const TransportSlot = require("../database/models/transport/transportSlots");
const ActivitySlots = require("../database/models/activities/activitySlots");
const AccommodationRooms = require("../database/models/accommodation/accommodationRooms");

// User Signup Route
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password", "firstName", "lastName"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  console.log("body is OK");

  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        savedTrips: [],
        reservedTrips: [],
        bankCard: {
          cardNumber: "",
          expiryDate: new Date("9999-12-31T23:59:59"),
          CVV: String,
        },
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// User Signin Route
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  console.log("body is OK");

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      return res.json({
        result: true,
        token: data.token,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } else {
      return res.json({
        result: false,
        error: "User not found or wrong password",
      });
    }
  });
});

// Get Reserved Trips by User Token
router.get("/:userToken/reservedTrips", (req, res) => {
  const token = req.params.userToken;
  User.findOne({ token })
    .populate("reservedTrips")
    .then((data) => {
      return res.json(data.reservedTrips);
    });
});

// Get Saved Trips by User Token
router.get("/:userToken/savedTrips", (req, res) => {
  const token = req.params.userToken;
  User.findOne({ token })
    .populate("savedTrips") // need to deepen the populate (with object)
    .then((data) => {
      return res.json(data.savedTrips);
    });
});

// Save Trip for User
router.post("/:userToken/saveTrip/:tripIndex", async (req, res) => {
  const { userToken, savedTrip } = await saveTrip(req);

  const updateResult = await User.updateOne(
    { token: userToken },
    { $push: { savedTrips: savedTrip._id } }
  );
  if (updateResult.modifiedCount <= 0) {
    return res.json({ res: false });
  }
  return res.json({ savedTrip, res: true });
});

// Reserve Trip for User
router.post("/:userToken/reserveTrip/:tripIndex", async (req, res) => {
  const { userToken, savedTrip } = await saveTrip(req);

  const updateResult = await User.updateOne(
    { token: userToken },
    { $push: { reservedTrips: savedTrip._id } }
  );
  return res.json({ savedTrip, updateResult });
});

// Add Payment Information for User
router.post("/:userToken/addPaiyementInfo", async (req, res) => {
  try {
    const user = await User.findById(req.params.userToken);
    const { nameOnCard, cardNumber, expiryDate, code } = req.body;

    if (!user) {
      return res.status(404).json({ result: false, message: "User not found" });
    }

    user.bankCardInfo = {
      nameOnCard,
      cardNumber,
      expiryDate: new Date(expiryDate),
      code,
    };

    await user.save();

    res.status(200).json({
      result: true,
      message: "Payment information saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      result: false,
      message: "Error saving payment information",
    });
  }
});

// Reset User Password
router.post("/:userToken/resetPassword", async (req, res) => {
  if (!checkBody(req.body, ["newPassword"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const newHash = bcrypt.hashSync(req.body.newPassword, 10);
  const operation = await User.updateOne(
    { token: req.params.userToken },
    { password: newHash }
  );
  if (operation.modifiedCount === 0)
    return res.json({ result: false, error: "Couldn't reset user's password" });
  res.json({ result: true });
});

module.exports = router;
