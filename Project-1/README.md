# Project-1 Backend API

Project-1 is a Node.js backend application built with Koa.js, TypeORM, and PostgreSQL. It provides a simple e-commerce-style backend with product listing APIs and user authentication features such as registration, login, and profile retrieval/update.

The project follows a layered architecture:

- app startup and middleware setup
- route registration
- controller handling requests
- service layer for business logic and database operations
- TypeORM entities for database mapping
- JWT-based authentication for protected routes

This project is a practical backend example for learning how a small API is structured, organized, and connected to a relational database.

## Features

- Koa server setup with middleware and route handling
- PostgreSQL database connection using TypeORM
- Product API endpoints for listing products and fetching individual products
- User registration and login endpoints
- JWT authentication for protected user routes
- Password hashing using bcryptjs
- Request validation using Yup
- Centralized error handling middleware
- Modular project organization using routes, controllers, services, and entities

## Tech Stack

- Node.js
- Koa.js
- PostgreSQL
- TypeORM
- JWT (jsonwebtoken)
- koa-jwt
- bcryptjs
- Yup
- @koa/router
- dotenv

## Project Structure

```bash
Project-1/
├── src/
│   ├── DB/
│   │   └── datasource.js
│   ├── Entities/
│   │   ├── category.js
│   │   ├── product.js
│   │   ├── role.js
│   │   └── user.js
│   ├── controller/
│   │   ├── productsController.js
│   │   └── userContoller.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── productRoute.js
│   │   └── usersRoute.js
│   ├── services/
│   │   ├── productServices.js
│   │   └── userServices.js
│   ├── validations/
│   │   ├── loginValidation.js
│   │   ├── userUpdateValidation.js
│   │   └── userValidation.js
│   ├── app.js
│   └── ...
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── node_modules/
```

## Application Architecture

The backend is organized in a standard layered pattern.

### 1. Server startup
The application is started in `src/app.js` using a Koa instance.

```js
const app = new Koa();

app.use(errorHandler);
app.use(bodyParser());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());
```

The server listens on the configured port and initializes the TypeORM database connection.

### 2. Database configuration
The TypeORM data source is configured in `src/DB/datasource.js`.

```js
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [path.join(process.cwd(), "src", "Entities", "*.js")],
  logging: false,
});
```

Important notes:

- `type: "postgres"` connects the app to PostgreSQL.
- `synchronize: true` automatically syncs the database schema with the entity definitions.
- This is useful for local development and learning, but it is not usually recommended for production without careful control.

### 3. Entity layer
The database entities live in `src/Entities`.

#### User entity
`src/Entities/user.js`

- stores user information such as `Id`, `email`, `password`, `name`
- includes a many-to-one relation with `Role`
- uses email as a unique field

#### Product entity
`src/Entities/product.js`

- includes product fields such as `id`, `name`, `description`, `stock`, `price`, and `imageURL`
- includes a many-to-one relation with `Category`

#### Role entity
`src/Entities/role.js`

- defines user roles
- has a one-to-many relation with users

### 4. Route layer
Routes are organized in `src/routes`.

#### Product routes
In `src/routes/productRoute.js`:

```js
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
```

#### User routes
In `src/routes/usersRoute.js`:

```js
router.post("/api/auth/register", createUser);
router.post("/api/auth/login", userLogin);
router.get("/api/users/me", auth, getUser);
router.put("/api/users/me", auth, updateUser);
```

### 5. Controller layer
Controllers handle HTTP requests and pass data to service functions.

Files:

- `src/controller/productsController.js`
- `src/controller/userContoller.js`

Examples:

- `createUser()` validates body data and creates a new user
- `userLogin()` validates credentials, checks the password, and creates a JWT
- `getUser()` reads the authenticated user from JWT token data
- `updateUser()` updates the logged-in user's profile

### 6. Service layer
Business logic and database interaction are handled in `src/services`.

#### User service functions
- `registerUser(data)`
- `findUserByEmail(email)`
- `findUserById(id)`
- `updateUser(...)`

These functions:

- hash passwords before saving
- check whether a role exists
- look up users by email or ID
- update user records safely

#### Product service functions
- `allProducts(ctx)`
- `oneProduct(ctx)`

These functions fetch products from the database and can include related category information.

### 7. Validation layer
The project uses Yup validation schemas.

Files:

- `src/validations/userValidation.js`
- `src/validations/loginValidation.js`
- `src/validations/userUpdateValidation.js`

Examples:

- registration ensures email is valid and password is provided
- login ensures required email/password fields exist
- update profile validates optional fields such as name, email, password, and role

### 8. Authentication flow
Authentication is performed using `koa-jwt`.

```js
const auth = koaJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });
```

Protected routes include:

- `GET /api/users/me`
- `PUT /api/users/me`

These routes require a valid JWT token in the `Authorization` header.

### 9. Error handling
The app includes a custom error handler in `src/middleware/errorHandler.js`.

This middleware catches errors thrown by controllers and returns consistent JSON error responses.

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- PostgreSQL running locally or on a server
- A database created for the project
- A valid `.env` file configured

## Installation

1. Clone the repository
2. Open the project folder in your terminal
3. Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root with the following values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=user
DB_NAME=ecommerce
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

### Environment variable explanation

- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port (default is 5432)
- `DB_USERNAME`: PostgreSQL user
- `DB_PASSWORD`: PostgreSQL password
- `DB_NAME`: database name
- `PORT`: server port
- `JWT_SECRET`: secret key used for signing JWTs

## Running the Project

Start the server in development mode:

```bash
npm run dev
```

This uses `nodemon` to restart the app automatically when code changes.

## Database Setup

Make sure PostgreSQL is running before starting the application.

Create the database named in the `.env` file, for example:

```sql
CREATE DATABASE ecommerce;
```

When the server starts, TypeORM will attempt to sync database tables based on the entity definitions.

## API Endpoints

### Product API

#### Get all products

```http
GET /products
```

Example:

```bash
curl http://localhost:3000/products
```

#### Get product by ID

```http
GET /products/:id
```

Example:

```bash
curl http://localhost:3000/products/1
```

### User Authentication API

#### Register user

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "Anish",
  "email": "anish@example.com",
  "password": "123456",
  "role": 1
}
```

This route validates the request and creates a new user record.

#### Login user

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "anish@example.com",
  "password": "123456"
}
```

Example response:

```json
{
  "message": "User Logged-In",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get authenticated user profile

```http
GET /api/users/me
```

Headers:

```http
Authorization: Bearer <jwt_token>
```

Example response:

```json
{
  "message": "User Found",
  "Id": "9f0f8f52-...",
  "email": "anish@example.com",
  "name": "Anish",
  "role": "admin"
}
```

#### Update authenticated user profile

```http
PUT /api/users/me
```

Headers:

```http
Authorization: Bearer <jwt_token>
```

Request body example:

```json
{
  "name": "Anish Silwal",
  "email": "newemail@example.com",
  "password": "newpassword123",
  "role": 2
}
```

Example response:

```json
{
  "message": "User Updated",
  "user": {
    "Id": "9f0f8f52-...",
    "email": "newemail@example.com",
    "name": "Anish Silwal",
    "Role": {
      "id": 2,
      "role": "user"
    }
  }
}
```

## Validation Rules

### Registration validation

Required fields:

- `name`: minimum 3 characters, maximum 50
- `email`: valid email format
- `password`: minimum 5 characters
- `role`: required number

### Login validation

Required fields:

- `email`: valid email
- `password`: required

### Update validation

Optional fields:

- `name`: min 3, max 100
- `email`: valid email format
- `password`: minimum 5 characters
- `role`: numeric role ID

## Example Product Response

```json
[
  {
    "id": 1,
    "name": "Samsung S26",
    "description": "Mobile",
    "stock": 15,
    "price": 400000,
    "imageURL": "image",
    "Category": {
      "id": 1,
      "name": "electronics"
    }
  }
]
```

## Notes

- The project uses TypeORM with `synchronize: true`, which is helpful for development but should be managed carefully in production.
- The project is a learning/demo backend and is not a production-hardened service yet.
- It demonstrates a clean separation of concerns between route handling, controller logic, and database services.
- Error handling and validation are included, but additional production improvements such as tests, request rate limiting, environment hardening, and role-based authorization can be added.

## Summary

Project-1 is a small backend API built with Koa.js, TypeORM, and PostgreSQL. It demonstrates how to create and organize a practical API with product endpoints, user authentication, JWT protection, validation, and database integration.

The project is ideal for learning backend structure and how APIs are built in Node.js using a layered architecture.
