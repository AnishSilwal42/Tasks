# Project-1 Backend API

Project-1 is a Node.js backend application built with Koa.js and TypeORM. It connects to PostgreSQL and exposes APIs for product listing and user authentication/management. The project follows a layered backend flow: application startup -> route registration -> controller logic -> service layer -> database access -> response handling.

## Project Purpose
This project is designed to demonstrate how a real backend API is structured in a small but practical application. It covers:

- Koa server setup and middleware usage
- Route-based API design
- Controller and service separation
- TypeORM database integration
- PostgreSQL database configuration
- JWT-based authentication for authenticated user endpoints
- Input validation with Zod
- Error handling for API responses

## Tech Stack
- Node.js
- Koa.js
- TypeORM
- PostgreSQL
- dotenv
- JWT (jsonwebtoken)
- koa-jwt
- bcryptjs
- Zod
- @koa/router

## Project Structure

```bash
Project-1/
├── src/
│   ├── DB/
│   │   └── datasource.js
│   ├── Entities/
│   │   ├── category.js
│   │   ├── product.js
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
│   └── app.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── node_modules/
```

## How the Project Works

The application follows a clear backend flow from server startup to database interaction.

### 1. Application startup
The entry point is `src/app.js`.

```js
const app = new Koa();
app.use(errorHandler);
app.use(bodyParser());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Number(process.env.PORT), () => {
  AppDataSource.initialize()
    .then(() => console.log("Connection successful"))
    .catch((error) => console.log(error));
});
```

What happens here:

- A Koa application is created.
- Custom error middleware is attached.
- Body parser is enabled so JSON request bodies can be read.
- User routes and product routes are mounted.
- The app listens on the configured port.
- TypeORM connection is initialized after the server starts.

### 2. Database connection
Database setup is handled in `src/DB/datasource.js`.

```js
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ["../Entities/*.js"],
  logging: false,
});
```

This configures the PostgreSQL connection for the project. The `synchronize: true` option automatically syncs the schema with the project entities, which helps in local development.

### 3. Entity definitions
The project has three main database entities:

- `User` in `src/Entities/user.js`
- `Product` in `src/Entities/product.js`
- `Category` in `src/Entities/category.js`

#### Product and Category relationship
In `product.js`, a product belongs to a category:

```js
relations: {
  Category: {
    type: "many-to-one",
    target: "categories"
  }
}
```

This means each product is linked to one category. The relation is loaded when fetching products using TypeORM with `relations: { Category: true }`.

#### User entity
The user table contains fields like:

- email (unique, primary key)
- passwordHash
- name
- role

This is used for authentication and profile management.

### 4. Route layer
Routes are defined in:

- `src/routes/productRoute.js`
- `src/routes/usersRoute.js`

#### Product routes
```js
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
```

These endpoints handle listing all products and fetching one product by ID.

#### User routes
```js
router.post("/api/auth/register", createUser);
router.post("/api/auth/login", userLogin);
router.get("/api/users/me", auth, getUser);
router.put("/api/users/me", auth, updateUser);
```

The user endpoints include JWT authentication for protected user actions.

### 5. Controller layer
Controllers receive the Koa request context, validate input where necessary, and call services.

#### Product controller
In `src/controller/productsController.js`:

```js
export async function getProduct(ctx) {
  const Product = await oneProduct(ctx);
  if (Product) {
    ctx.body = Product;
  } else {
    ctx.throw(404, "Not found");
  }
}

export async function getProducts(ctx) {
  const Products = await allProducts(ctx);
  ctx.status = 200;
  ctx.body = Products;
}
```

#### User controller
In `src/controller/userContoller.js`:

- `createUser()` validates and registers a new user
- `userLogin()` checks the user email and password, then issues a JWT
- `getUser()` returns authenticated user information from `ctx.state.user`
- `updateUser()` updates a logged-in user profile

### 6. Service layer
The actual database logic is handled in the service files:

- `src/services/productServices.js`
- `src/services/userServices.js`

#### Product service flow
```js
const Products = AppDataSource.getRepository(Product);
const selectedProduct = await Products.findOne({
  where: { id: ctx.params.id },
  relations: { Category: true },
});
```

This fetches a product by ID and includes its category information.

#### User service flow
- Passwords are hashed with `bcryptjs` before storing.
- User login compares the provided password with the stored hash.
- JWT is generated using `jsonwebtoken`:

```js
const token = jwt.sign(
  { email: user.email, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: "2h", algorithm: "HS256" }
);
```

### 7. Authentication flow
The protected routes use `koa-jwt`:

```js
const auth = koaJwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });
```

This ensures that a valid JWT token is required before a user can access:

- `GET /api/users/me`
- `PUT /api/users/me`

If the token is missing or invalid, the request is rejected.

### 8. Error handling
The application uses a custom centralized error middleware in `src/middleware/errorHandler.js`.

```js
export default async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: true,
      status: err.status,
      message: err.message || "Internal Server Error",
      details: err.details || []
    };
  }
}
```

This ensures each API error is returned consistently in JSON format.

## Environment Configuration
Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=ecommerce
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=user
DB_NAME=ecommerce
PORT=3000
JWT_SECRET=my_secure_secret
```

## Installation
1. Open the project directory.
2. Install dependencies:

```bash
npm install
```

3. Make sure PostgreSQL is running.
4. Create the database mentioned in `.env`.
5. Start the project.

## Running the Project

Use:

```bash
npm run dev
```

This starts the Koa server using `nodemon`, so the app automatically restarts when files change.

## API Endpoints

### Product APIs

#### Get all products
```http
GET /products
```

Example:
```bash
curl http://localhost:3000/products
```

#### Get one product by ID
```http
GET /products/:id
```

Example:
```bash
curl http://localhost:3000/products/1
```

### User Authentication APIs

#### Register a user
```http
POST /api/auth/register
```

Request body:
```json
{
  "name": "Anish",
  "email": "anish@example.com",
  "password": "123456"
}
```

#### Login a user
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

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get authenticated user profile
```http
GET /api/users/me
```

Headers:
```http
Authorization: Bearer <token>
```

#### Update authenticated user profile
```http
PUT /api/users/me
```

Headers:
```http
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Anish Silwal",
  "email": "newemail@example.com"
}
```

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

## Example Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Notes
- The project uses `synchronize: true`, so TypeORM will auto-sync the database schema with the entity definitions.
- This is a practical learning project for building a small backend API using Koa and PostgreSQL.
- The project combines both product management and user authentication in one application, showing how separate routes and service layers can work together.

## Summary
Project-1 is a full backend API project built with Koa.js and TypeORM. It starts by creating a server, connecting to PostgreSQL, registering routes, and processing requests through controllers and services. It includes product-related endpoints as well as JWT-protected user authentication and profile APIs, making it a good example of a clean Node.js backend structure.
