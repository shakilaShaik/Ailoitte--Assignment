import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes/index.js';
dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce REST API',
    version: '1.0.0',
    description: 'API docs for E-Commerce assignment'
  },
  servers: [ {
    url: process.env.NODE_ENV === "production" 
      ? process.env.PROD_API_URL 
      : "http://localhost:4000"
  }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
};

const options = { definition: swaggerDefinition, apis: ['./src/routes/*.js', './src/controllers/*.js'] };
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);
app.get('/', (req, res) => res.json({ status: 'ok' }));

export default app;
