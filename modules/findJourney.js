const findJourney = (
  classes,
  outboundJourneys,
  inboundJourneys,
  totalBudget,
  nbrOfTravelers
) => {
  const validCombinations = [];

  for (let outboundClass of classes) {
    for (let outboundJourney of outboundJourneys) {
      const outboundPrice = outboundJourney[outboundClass].price;
      const remainingSeatsOutbound =
        outboundJourney[outboundClass].nbRemainingSeats - nbrOfTravelers;

      for (let inboundClass of classes) {
        for (let inboundJourney of inboundJourneys) {
          const inboundPrice = inboundJourney[inboundClass].price;
          const remainingSeatsInbound =
            inboundJourney[inboundClass].nbRemainingSeats - nbrOfTravelers;
          const totalCost = outboundPrice + inboundPrice;

          if (totalCost <= totalBudget / 3) {
            validCombinations.push({
              outboundJourney: {
                id: outboundJourney._id,
                type: outboundJourney.transportBase.type,
                class: outboundClass,
                seats: {
                  from: Number(remainingSeatsOutbound),
                  to: Number(remainingSeatsOutbound + nbrOfTravelers),
                },
                departure: outboundJourney.departure.date,
                arrival: outboundJourney.arrival.date,
                price: Number(outboundPrice.toFixed(2)),
              },
              inboundJourney: {
                id: inboundJourney._id,
                type: inboundJourney.transportBase.type,
                class: inboundClass,
                seats: {
                  from: Number(remainingSeatsInbound),
                  to: Number(remainingSeatsInbound + nbrOfTravelers),
                },
                departure: inboundJourney.departure.date,
                arrival: inboundJourney.arrival.date,
                price: Number(inboundPrice.toFixed(2)),
              },
              totalCost: Number(totalCost.toFixed(2)),
            });
          }
        }
      }
    }
  }
  if (validCombinations.length > 0) {
    validCombinations.sort((a, b) => a.totalCost - b.totalCost);
    return validCombinations[0];
  }
  return false;
};

module.exports = findJourney;
