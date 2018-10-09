# Alchemy Connect
Make the most of your networking efforts

![alt text](https://contattafiles.s3.us-west-1.amazonaws.com/tnt9084/WU_ginyTS2HWg7A/AlchemyConnect-Contact-phonemockup.jpg "Alchemy Connect")

This mobile-enabled web application provides a quick way to create, store, review, and edit information about networking events you've attended and the contacts you met there.

## To Run Locally

This application is intended to be used on mobile devices.

To run this application locally: 
1. Download files from both repositories (described below) and place them in a single folder.   
1. Create a postgres database and enter the connection string in an .env file on the server side.
1. Run 'npm i' to install all dependencies. 
1. In the server folder, run 'npm run db-load-all' to create tables and seed starter data.
1. Start the express server.
1. In the app folder, start the Vue server.

## Structure

The code for this application is stored in two separate repositories.  This readme covers both the server and application sides.
* https://github.com/Team-Cricket/server
* https://github.com/Team-Cricket/app

### Server

* Seed data is stored as JSON files in server/data.
* Scripts to create tables and populate tables are stored in server/scripts.
* All http routes are defined in server.js.

## Contributors
Carrie Carter,
Karen Painter,
Kevin Grayson,
[Sarah Rehmer](https://github.com/Rehmsy)

### App

File | Purpose
--- | --- 
**app/App.vue** | This is the parent component for the application.  Handles user login status.
**app/main.js** | Creates the vue and router instance
**app/router.js** | Defines the router paths
**app/services/api.js** | Provides functions to interact with database
**app/components/NavBar.vue** | Always visible when the user is logged in.  Main navigation.
**app/components/LoginForm.vue** | Enables login and signup.
**app/components/Dashboard.vue** | Enables users to switch between a list of their events or a list of their contacts.
**app/components/EventsList.vue** | Displays all of a user's events in a list.  Enables deletes.
**app/components/EventsForm.vue** | Allows creating and editing events.
**app/components/ContactsList.vue** | Displays all of a user's contacts in a list.  Enables deletes.
**app/components/ContactsForm.vue** | Allows creating and editing contacts.  Every contact is a child of an event.  

