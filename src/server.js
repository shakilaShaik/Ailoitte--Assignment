import app from './app.js';
import dotenv from 'dotenv';
import db from './models/index.js';
 dotenv.config();

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await db.sequelize.authenticate();
    console.log('DB connected');
    // Do not sync in production; use migrations
    await db.sequelize.sync(); // safe for development - creates missing tables
    app.listen(PORT, () => {
      // console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app', err);
    process.exit(1);
  }
}

start();
