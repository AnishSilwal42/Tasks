# Project-1

A simple Node.js project using Koa, TypeORM, and PostgreSQL.

## Features
- REST API setup with Koa
- PostgreSQL database connection using TypeORM
- Product and Category entities
- Basic route structure

## Installation
1. Open the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your database settings:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

## Run the project
```bash
npm run dev
```

## Main folders
- `src/DB` - database connection
- `src/Entities` - database models
- `src/routes` - API routes
- `src/controller` - route logic
- `src/middleware` - custom middleware
