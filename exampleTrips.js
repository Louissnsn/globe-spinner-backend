const tripA = {
  user: "65773cd8e4937e5b7c371dc0",
  nbOfTravelers: 3,
  destination: "London",
  outboundJourney: {
    transportSlot: "65775ce908d3844c8694aa37",
    transportExtras: ["65775ba1c9ef9eadcadb80f3", "65775ba1c9ef9eadcadb80f4"],
    seatNb: 96,
    class: "first",
  }, // l'aller
  inboundJourney: {
    transportSlot: "65775ce908d3844c8694aa39",
    transportExtras: ["65775ba1c9ef9eadcadb80f5", "65775ba1c9ef9eadcadb80f6"],
    seatNb: 45,
    class: "second",
  }, // le retour
  accommodation: {
    accommodationSlot: "6574f74c91c999459abf4634",
    accommodationExtras: [
      "6574d100a2293c529e940b09",
      "6574d100a2293c529e940b0d",
    ],
  },
  activities: [
    {
      activitySlot: "65750227a93e046c9f08ee19",
      activityExtras: [
        "65750119da1bcf834514a2d8",
        "65750119da1bcf834514a2da",
        "65750119da1bcf834514a2dc",
      ],
    },
  ],
  totalPaidAmount: 1450,
};

const tripB = {
  user: "65773cd8e4937e5b7c371dc0",
  nbOfTravelers: 3,
  destination: "London",
  outboundJourney: {
    transportSlot: "65775ce908d3844c8694aa37",
    transportExtras: ["65775ba1c9ef9eadcadb80f3", "65775ba1c9ef9eadcadb80f4"],
    seatNb: 96,
    class: "first",
  }, // l'aller
  inboundJourney: {
    transportSlot: "65775ce908d3844c8694aa39",
    transportExtras: ["65775ba1c9ef9eadcadb80f5", "65775ba1c9ef9eadcadb80f6"],
    seatNb: 45,
    class: "second",
  }, // le retour
  accommodation: {
    accommodationSlot: "6574f74c91c999459abf4634",
    accommodationExtras: [
      "6574d100a2293c529e940b09",
      "6574d100a2293c529e940b0d",
    ],
  },
  activities: [
    {
      activitySlot: "65750227a93e046c9f08ee19",
      activityExtras: [
        "65750119da1bcf834514a2d8",
        "65750119da1bcf834514a2da",
        "65750119da1bcf834514a2dc",
      ],
    },
  ],
  totalPaidAmount: 1450,
};

module.exports = { tripA, tripB };
