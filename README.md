###HRMS

Table of Contents

Prerequisites
Project Structure
Setup Instructions
Frontend Setup
Backend Setup


Prerequisites
Ensure you have the following installed:

Node.js: v16 or higher
npm: v8 or higher
MongoDB: A MongoDB instance (local or cloud, e.g., MongoDB Atlas)

Project Structure
hrms/
├── client/                # Vite.js frontend
│   
├── server/               # Express.js backend
└── README.md            # Project documentation

Setup Instructions
Frontend Setup

Navigate to the frontend directory:cd client


Install dependencies:npm install



Backend Setup

Navigate to the backend directory:cd server


Install dependencies:npm install


Set up MongoDB:
Create a MongoDB database (e.g., via MongoDB Atlas).
Create a .env file in the server directory and add your MongoDB connection string:MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority


Replace <username>, <password>, and <dbname> with your MongoDB credentials and database name.


Seed the database:
Run the seed script to populate initial data
script : node seedData.js





Running the Application
Frontend

Navigate to the client directory:cd client


Start the development server:npm run dev


Open your browser and visit http://localhost:5173 (or the port specified in the terminal).

Backend

Navigate to the server directory:cd server


Start the development server:npm run dev


The backend will run on http://localhost:5000 (or the port specified in your server.js).

Note: Ensure the backend is running before starting the frontend, as the frontend may make API calls to the backend.
