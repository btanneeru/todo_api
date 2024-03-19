## Application Details
  - This is a completely API based backed application, We don't have a UI/Frontend, For UI have seperate application.
  - Used NodeJs as a Backend tech and MongoDB Database
  - Used NoSQL injection with mongo-sanitize
  - Used Swagger for API Documentation
  - Created Todo Module for showing todos list

## Before using

- Please make sure that you have:
 - node.js installed (https://nodejs.org/)
 - npm installed
 - cros-env installed
 - have mongodb installed and running locally (https://www.mongodb.com/)
   - Using Windows, just open the terminal at where you installed mongo and run `mongod.exe`
 - NOTE: Please give your mongodb connection url in /.env-dev file as MongoDBAtlas has some ristrictions to connect from mutiple networks.
 - run npm install in your root project folder
 - run npm install nodemon in your root project folder
 - run npm install express in your root project folder. Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.Reference URL:(https://expressjs.com/)

## Start Project

To run the project, please use a command line the following:
```
 - npm install
 - npm start
``` 
It will run the server at port 5000.

## API Endpoints

*Base URL*
- V1: http://localhost:5000/api/

*Swagger URL*
- V1: http://localhost:5000/api-docs/

## Project Usecases

- Created CRUD functionalities of Todo module
- Used Socket.io for showing tasks count in notification