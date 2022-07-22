import express from 'express';
import cors from 'cors';
import equitiesRouter from './src/routes/equities.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', equitiesRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  try {
    console.log(`Listening port ${port}`);
  } catch(error) {
    console.log(`Error ${error}`);
  }
});
