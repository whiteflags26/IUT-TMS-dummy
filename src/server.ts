import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './presentation/routes/authRoutes';
import requisitionRoutes from './presentation/routes/requisitionRoutes';
import qs from 'qs';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Custom middleware to parse query strings using qs
app.use((req: Request, res: Response, next: NextFunction) => {
  req.query = qs.parse(qs.stringify(req.query));
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requisitions', requisitionRoutes);

// Basic route for testing
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
