import dotenv from 'dotenv'

dotenv.
  config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
  });

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // required for Render
      },
    }},
    test: {
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASS || "shammu",
      database: process.env.DB_NAME_TEST || "ecommerce_db",
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
    },
    production: {
      url: process.env.DATABASE_URL, // Render Postgres URL
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // required for Render
        },
      },
      logging: false,
    },
  };
