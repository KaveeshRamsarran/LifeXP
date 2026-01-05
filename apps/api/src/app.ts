import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import questRoutes from './routes/questRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health check / root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LifeXP API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      tasks: '/api/v1/tasks',
      quests: '/api/v1/quests',
      user: '/api/v1/me'
    }
  });
});

app.get('/api/v1', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LifeXP API v1',
    endpoints: ['auth', 'tasks', 'quests', 'me']
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/quests', questRoutes);
app.use('/api/v1/me', userRoutes);

app.use(errorHandler);

export default app;
