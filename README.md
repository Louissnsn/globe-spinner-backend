## GLOBE SPINNER
Globe Spinner est mon projet de fin d'étude : une application mobile capable de générer un voyage aléatoire après la sélection de plusieurs filtres par les utilisateur·ice·s 

## globe_spinner_backend stack : 
- NodeJS
- ExpressJS
- MongoDB

## Routes 

# Users 
- POST /signup
- GET /signin
- GET /reservedTrips/:userToken
- POST /saveTrip/:userToken/:tripIndex
- POST /addPaymentInfos/:userToken
- POST /resetPassword/:userToken

# Trips 
- GET /newAccommodation/:LocationDeparture/:depDate/:arrivDate/:duration/:budget/:people
- POST /generate
