 # Prerequisites 

Node.js and npm installed on your machine. Download and install from https://nodejs.org/

MongoDB installed locally or a MongoDB cloud database set up. Download MongoDB https://www.mongodb.com/try/download/community or sign up for MongoDB Atlas https://www.mongodb.com/cloud/atlas. 

## Setup Project 

Clone the Project Repository: 

git clone https://github.com/DharatiAjudiya/SwapCircle.git 

Go to main branch: git checkout main 

## Set Up the Backend: 

Navigate to the backend directory: cd swapcircle-backend 

Install dependencies: npm install 

Configure environment variables: 

Change following configuration in .env file in the backend root folder  

DATABASE_URL= mongodb://localhost:27017/swapcircle 

Start the backend server: npm start 

The backend should now be running on http://localhost:3000 (port may vary). 

## Set Up the Frontend: 

Navigate to the frontend directory: cd swapcircle 

Install dependencies: npm install 

Run the development server: npm run dev 

The frontend application should now be running locally, accessible via http://localhost:5173 (port may vary). 

## Set Up the MongoDB: 

Open your MongoDB client (e.g., MongoDB Compass or command line). 

Create a new database named swapcircle. 

Import all .json collections from git located in DbSetup folder.  
