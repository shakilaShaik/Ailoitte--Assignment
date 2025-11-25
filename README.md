# E-Commerce Backend (Sequelize + Postgres)

Structure and instructions included.

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   ```
   npm install
   ```
3. Run migrations:
   ```
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```
4. Start server:
   ```
   npm run dev
   ```

Swagger UI: http://localhost:4000/api-docs
