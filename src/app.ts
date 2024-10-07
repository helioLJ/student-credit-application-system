import express from 'express';
import 'reflect-metadata';
import studentRoutes from './routes/studentRoutes';
import creditRoutes from './routes/creditRoutes';
import adminRoutes from './routes/adminRoutes';
import dotenv from 'dotenv';
import { initializeDataSource } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/admin', adminRoutes);

// Add Swagger UI middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

export const startServer = async () => {
  await initializeDataSource();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

export default app;
