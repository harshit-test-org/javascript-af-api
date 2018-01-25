import express from 'express';
import morgan from 'morgan';
import homeRoutes from './routes/home';

const app = express();

app.use('/', homeRoutes);

export default app;
