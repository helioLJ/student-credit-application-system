# Student Credit Application System

## Overview

This project is a robust Student Credit Application System built with TypeScript, Express, and TypeORM. It provides a secure and efficient platform for students to register, login, and apply for credit, with an admin interface for managing applications.

## Key Features

- Student registration and authentication
- Credit application submission and management
- Admin dashboard for overseeing credit applications
- Secure JWT-based authentication
- RESTful API design
- Comprehensive test coverage
- Swagger API documentation

## Technology Stack

- **Backend**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Testing**: Jest
- **Authentication**: JWT
- **API Documentation**: Swagger
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

## Project Structure

The project follows a clean, modular architecture:
```bash
src/
├── config/ # Configuration files
├── controllers/ # Request handlers
├── middleware/ # Custom middleware
├── models/ # Database models
├── routes/ # API routes
├── services/ # Business logic
├── utils/ # Utility functions
└── types/ # TypeScript type definitions
```


## Clean Code and Best Practices

- **Separation of Concerns**: The project is structured into distinct layers (controllers, services, models) for better maintainability.
- **DRY (Don't Repeat Yourself)**: Common functionalities are abstracted into reusable services and utilities.
- **SOLID Principles**: The codebase adheres to SOLID principles, particularly the Single Responsibility Principle in the service layer.
- **Error Handling**: Consistent error handling across the application with custom error classes.
- **Code Style**: Enforced consistent code style using ESLint and Prettier.

## Design Patterns

- **Repository Pattern**: Used in the service layer to abstract database operations.
- **Dependency Injection**: Controllers depend on service interfaces, allowing for easier testing and flexibility.
- **Middleware Pattern**: Custom middleware for authentication and request processing.

## Testing

- Comprehensive unit tests for controllers, services, and middleware.
- Integration tests for API endpoints.
- Use of mocks and stubs for isolated unit testing.

## Code Quality Tools

- **ESLint**: For identifying and fixing code quality issues.
- **Prettier**: For consistent code formatting.
- **Husky**: Pre-commit hooks to ensure code quality before commits.

## Getting Started

To set up and run this project locally, follow these steps:

1. **Clone the repository**
   ```
   git clone https://github.com/helioLJ/student-credit-application-system.git
   cd student-credit-application-system
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up the database using Docker**
   - Run the following command to start the database container:
     ```
     docker-compose up -d
     ```

4. **Configure environment variables**
   - Copy the `.env.example` file to `.env`:
     ```
     cp .env.example .env
     ```
   - Open the `.env` file and update the following variables:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=your_postgres_username
     DB_PASSWORD=your_postgres_password
     DB_NAME=your_database_name
     JWT_SECRET=your_jwt_secret
     ```

5. **Run database migrations**
   ```
   npm run migration:run
   ```

6. **Seed the database (optional)**
   ```
   npm run seed
   ```

7. **Start the development server**
   ```
   npm run dev
   ```

The server should now be running on `http://localhost:3000` (or the port specified in your `.env` file).

## Running Tests

This project uses Jest for testing. To run the tests, follow these steps:

1. **Run all tests**
   ```
   npm test
   ```

2. **Run tests with coverage report**
   ```
   npm run test:coverage
   ```

3. **Run tests in watch mode (for development)**
   ```
   npm run test:watch
   ```

## API Documentation

After starting the server, you can access the Swagger API documentation at:

```
http://localhost:3000/api-docs
```

This provides an interactive interface to explore and test the API endpoints.

## Roadmap

1. **Repository Layer**: Implement a dedicated repository layer to abstract database operations from services.
2. **Data Transfer Objects (DTOs)**: Introduce DTOs for improved type safety and data validation.
3. **Validation Layer**: Implement request validation using libraries like Joi or class-validator.
4. **Enhanced Error Handling**: Centralize error handling with custom error classes and consistent error responses.
5. **Logging System**: Implement a robust logging system using Winston or similar libraries.
6. **Configuration Management**: Centralize configuration using environment variables and dotenv.
7. **Expanded Middleware**: Add more middleware for request logging, CORS handling, etc.
8. **Utils/Helpers Layer**: Create a dedicated layer for utility functions and helper methods.
9. **Constants Layer**: Implement a constants file for storing application-wide constant values.