import d from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

d.config({
  path: `${__dirname}/../.env`
});

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo :)');
});

mongoose.connection.on('error', e => {
  console.log(`Mongo error -> ${e}`);
});

// Include models here (for mongoose singleton to work)
import './models/Users';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`API started on PORT ${PORT}`);
});
