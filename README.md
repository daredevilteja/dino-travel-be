# Dino-Travels-Backend 
Dino Travels is a web application where users can create an account and book a dino for travelling from one place to another. Users can book a ride, cancel a ride or finish a ride. Users can also view their travel history and their profile. This is the backend of the Dino Travels web application. You can view the live website [here](https://dino-travel.herokuapp.com/).

# Local Setup
1. Install [Node.js](https://nodejs.org/en/) in your local machine.
2. Install [Postman](https://www.postman.com/downloads/) in your local machine for testing the apis.
3. Now clone the repository to your local machine.
4. Open a terminal inside the root of your repository.
5. Run `npm install` to install all the dependencies.
6. Run `npm start` to start the server.
7. Now using **Postman** you can consume the apis.

# API Information
1. /signup - This endpoint is used to create a new user. We have to pass userName, password, email, dob, sex, country, phNum in request body to create the user.
2. /login - This endpoint is used to access a created user account. We have to pass correct email and password in the request body to login.
3. /logout - This endpoint is used to logout the current signed in user.
4. /profile - This endpoint is used to access the user details. This endpoint can't be accessed because userId which is present in database is required to access the user details.
5. /myTravels - This endpoint is used to access the travel history of the user. This endpoint can't be accessed because userId which is present in database is required to access the user details.
