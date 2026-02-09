---
description: Repository Information Overview
alwaysApply: true
---

# ActivLine Backend Information

## Summary
ActivLine Backend is a Node.js-based API built using the Express.js framework, Mongoose for MongoDB orchestration, and Socket.io for real-time communication. It serves as the backend service for the ActivLine platform, handling authentication, customer management, file uploads, and notification services.

## Structure
The project follows a standard service-oriented architecture:
- [./src/controllers/](./src/controllers/): Handles incoming API requests and orchestrates responses.
- [./src/models/](./src/models/): Defines Mongoose schemas for data persistence.
- [./src/routes/](./src/routes/): Maps API endpoints to their respective controllers.
- [./src/services/](./src/services/): Contains core business logic and database interactions.
- [./src/middlewares/](./src/middlewares/): Custom Express middlewares for auth, validation, and error handling.
- [./src/socket/](./src/socket/): Manages real-time events and connections via Socket.io.
- [./src/validations/](./src/validations/): Joi schemas for request body and parameter validation.
- [./src/db/](./src/db/): Database connection logic.
- [./uploads/](./uploads/): Local storage directory for uploaded files (e.g., chat attachments).

### Main API Components
- **Auth**: Authentication and session management.
- **Admin & Dashboard**: Administrative tools and system overview.
- **Customer & Staff**: User-specific management modules.
- **Franchise**: Franchise-related operations.
- **Chat**: Real-time messaging implementation.
- **Notifications**: System alerts and messages.
- **Logs**: Activity tracking and logging.

## Language & Runtime
**Language**: JavaScript (ES Modules)  
**Runtime**: Node.js  
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- **Express**: Web framework for building APIs.
- **Mongoose**: MongoDB object modeling tool.
- **Socket.io**: Real-time, bidirectional communication.
- **JSONWebToken & Bcrypt**: Authentication and password hashing.
- **Cloudinary & Multer**: File upload and cloud storage integration.
- **Nodemailer**: Email notification service.
- **Joi**: Data validation.
- **Firebase-Admin**: Integration with Firebase services.
- **Axios**: HTTP client for external API requests.

**Development Dependencies**:
- **Nodemon**: Utility for automatically restarting the server during development.

## Build & Installation
```bash
# Install dependencies
npm install

# Run the server in development mode (with nodemon)
npm run dev

# Start the server in production mode
npm start
```

## Main Files & Resources
- [./server.js](./server.js): The main entry point that initializes the HTTP server, database connection, and Socket.io.
- [./app.js](./app.js): Configures the Express application, including CORS, middlewares, and route mounting.
- [./src/routes/index.route.js](./src/routes/index.route.js): The central router that combines all feature-specific routes.
- [./.env.example](./.env.example): (Not found, but `.env` is used for environment variables like `PORT`, `ACCESS_TOKEN_SECRET`, and `MONGODB_URI`).

## Testing
No dedicated testing framework (like Jest or Mocha) was identified in the repository configuration.
