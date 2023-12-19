const moment = require("moment");

const findActivities = async (
  collection,
  numberOfTravelers,
  totalBudget,
  arrival,
  departure,
  destination,
  nbrOfNights
) => {
  let totalActivities = 0;

  const activities = await collection.aggregate([
    {
      $match: {
        remainingPlaces: { $gte: numberOfTravelers },
        price: { $lte: totalBudget / 3 },
      },
    },
    {
      $lookup: {
        from: "activity_bases",
        localField: "activityBase",
        foreignField: "_id",
        as: "activityBase",
      },
    },
    {
      $unwind: "$activityBase",
    },
    {
      $match: {
        startTime: {
          $gte: moment(arrival).add(1, "d").toDate(),
          $lte: moment(departure).subtract(1, "d").toDate(),
        },
        endTime: {
          $gte: moment(arrival).add(1, "d").toDate(),
          $lte: moment(departure).subtract(1, "d").toDate(),
        },
        // locationArray: {
        //   $geoWithin: {
        //     $centerSphere: [[destination.lon, destination.lat], 10 / 6371],
        //   },
        // },
      },
    },
    {
      $limit: nbrOfNights - 1, // Add the $limit stage with the desired maximum value
    },
  ]);

  if (activities.length == 0) {
    return false;
  }

  for (let activity of activities) {
    totalActivities += activity.price;
  }
  return { totalActivities, activities };
};

module.exports = findActivities;
