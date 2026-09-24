# Project-1

Project-1 is a Node.js backend project built with Koa and TypeORM. It is designed to connect to a PostgreSQL database and expose simple APIs for managing products and categories. The project demonstrates how to create database entities, connect the app to PostgreSQL, and build route handlers for fetching data.

## Project Purpose
This project is mainly focused on learning and practicing:
- Node.js server setup using Koa
- REST API routing
- Database connectivity with PostgreSQL
- Object-Relational Mapping (ORM) using TypeORM
- Entity relationship between products and categories

## Tech Stack
- Node.js
- Koa.js
- TypeORM
- PostgreSQL
- dotenv

## Folder Structure
```bash
Project-1/
├── src/
│   ├── DB/
│   │   └── connection.js
│   ├── Entities/
│   │   ├── product.js
│   │   └── category.js
│   ├── controller/
│   │   ├── getProduct.js
│   │   └── getProducts.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── getRoute.js
│   ├── app.js
│   └── server setup files
├── package.json
├── .env
├── README.md
└── node_modules/
```

## Main Features
- Connects to PostgreSQL using TypeORM
- Defines `Product` and `Category` entities
- Implements `GET /products` route to fetch all products
- Implements `GET /products/:id` route to fetch a single product by ID
- Includes error handling middleware
- Shows relationship mapping between products and categories

## Database Setup
Create a `.env` file in the root of the project with the following values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_NAME=project1_db
```

## Installation
1. Open the project folder.
2. Install dependencies:

```bash
npm install
```

3. Make sure PostgreSQL is running and the database exists.
4. Add your database credentials in the `.env` file.

## Run the Project
Use the following command:

```bash
npm run dev
```

This starts the server and runs the application on the configured port.

## API Endpoints

### Get all products
```http
GET /products
```

Example URL for Postman:
```text
http://localhost:3000/products
```

### Get one product by ID
```http
GET /products/:id
```

Example URL for Postman:
```text
http://localhost:3000/products/1
```

These are the predefined paths you can use for Postman testing and screenshots.

## Expected Behavior
- `GET /products` returns all product records.
- `GET /products/1` returns a single product with ID `1`.
- If no product exists for the given ID, the server responds with a 404 error.

## Example Response
### GET /products
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

### GET /products/1
```json
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
```

## Notes
- The project uses `synchronize: true`, so the database schema can be automatically updated.
- In a real production project, you should normally be more careful with database synchronization and migrations.
- This project is a beginner-friendly backend example for learning API development with Node.js and TypeORM.

## Summary
Project-1 is a basic backend project that connects to PostgreSQL, defines product and category data models, and provides GET APIs to fetch records. It is useful for learning how to build a backend application with Koa, ORM, and relational database mapping.
