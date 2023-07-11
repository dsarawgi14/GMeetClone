# Real-Time Video Conferencing App
This project is a GMeet clone developed using Node.js, Express, Socket.IO, and PeerJS. It allows users to establish live peer-to-peer connections for video meetings. User authentication is implemented using Google OAuth with the help of Passport.

## Features
* Live peer-to-peer connections for video meetings.  
* User authentication through Google OAuth.  
* Mesh network topology for meetings setup.  
* Joining existing rooms or creating new ones.  
* Waiting page before joining rooms to interact with camera and microphone settings.
* Screen sharing and whiteboard options during meetings.  
* Leave meeting functionality with options to close/open video and microphone.  
* Rejoining meetings or redirecting to the home page after leaving.  

## Prerequisites
Before running the application, ensure you have the following prerequisites installed:
* Node.js (v12.0.0 or higher)  
* npm (Node Package Manager)  

## Installation

Navigate to the project directory and inside it, install the dependencies:
```bash
npm install
```
Create a `.env` file in the project root directory and add your own credentials:
```bash
GOOGLE_CLIENT_ID = #add your own Client ID
GOOGLE_CLIENT_SECRET = #add your own Client Secret
GOOGLE_CALLBACK_URL = http://localhost:5500/google/callback
```

## Usage

Run the server:
```bash
node server.js
```
The application will go live at `http://localhost:5500`


