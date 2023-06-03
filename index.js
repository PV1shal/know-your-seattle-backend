import express from 'express';
import cors from 'cors';
import crimeRoutes from './api/crime.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/crimes', crimeRoutes);
app.use('*', (req, res) => res.status(404).json({ error: 'Not found' }));

export default app;