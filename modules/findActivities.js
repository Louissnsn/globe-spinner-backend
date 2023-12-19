const moment = require("moment");

const findActivities = async (
  collection,
  numberOfTravelers,
  totalBudget,
  arrival,
  departure,
  destination
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
      $addFields: {
        startTime: {
          $cond: {
            if: {
              $eq: [{ $type: "$startTime" }, "string"],
            },
            then: {
              $toDate: "$startTime",
            },
            else: "$startTime",
          },
        },
        endTime: {
          $cond: {
            if: {
              $eq: [{ $type: "$endTime" }, "string"],
            },
            then: {
              $toDate: "$endTime",
            },
            else: "$endTime",
          },
        },
        locationArray: [
          "$activityBase.location.longitude",
          "$activityBase.location.latitude",
        ],
      },
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
