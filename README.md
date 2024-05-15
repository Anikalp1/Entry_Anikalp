# Basic Headless CMS

A rudimentary headless CMS with extremely basic CRUD functionality, similar to a simplified version of Strapi.js. This project enables users to create different entities from the frontend by specifying attributes and their types. Upon entity creation, the application automatically generates a table definition in an RDBMS (MySQL or PostgreSQL only). Users can then perform CRUD operations (Create, Read, Update, Delete) on the created entities directly from the frontend.

## Technologies Used

- React
- CSS
- Node.js
- Express.js
- MySQL

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Anikalp1/Anikalp_Submission.git
    ```

2. **Install Dependencies:**

    ```bash
    cd client
    npm install

    cd server
    npm install
    ```

3. **Start the Development Server:**

    Run `npm start` in both the `client` and `server` folders to start the frontend and backend servers concurrently:

    ```bash
    cd client
    npm start

    cd ../server
    nodemon index.js
    ```

    This will typically start the frontend server on `http://localhost:3000` and the backend API on `http://localhost:8080` (adjust ports as needed).

## Changes to run this program locally

In order to run this project locally or deploy it to a server, you need to make following changes in index.js file

### Database Configuration

- `host`: The host address of your database server.
- `user`: The username used to authenticate with the database server.
- `password`: The password used to authenticate with the database server.
- `name`: The name of the database to be used by the application.

## Usage

Once the project is running, you can use the frontend interface to create, read, update, and delete entities:

### Create Entities

- Specify the entity name and its attributes with their data types (e.g., string, number, Date).
- The system will automatically create a corresponding table in your MySQL database.

### CRUD Operations

- Create, view, edit, and delete data entries within the created entities using the provided frontend interface.

## Additional Notes

- This is a basic implementation and may require further development for more complex use cases.
- Consider security best practices when storing sensitive data in environment variables. Explore environment variable management tools for production environments.