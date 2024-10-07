import express from 'express';
import 'reflect-metadata';
import studentRoutes from './routes/studentRoutes';
import creditRoutes from './routes/creditRoutes';
import adminRoutes from './routes/adminRoutes';
import dotenv from 'dotenv';
import { initializeAppDataSource } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler
app.use(
  (err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    console.error('Error details:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  },
);

export const startServer = async (): Promise<void> => {
  await initializeAppDataSource();

  const port = process.env.PORT || 3000;
  app.listen(port, (): void => {
    console.log(`Server running on port ${port}`);
  });
};

export default app;
