import express from 'express';
import morgan from 'morgan';

const app = express();

app.get('/', (req, res) => {
  res.json({
    hello: 'world'
  });
});

export default app;
