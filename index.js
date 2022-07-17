const express = require('express');
const cors = require('cors');
const app = express();

const api = require('./src/data/api.json');

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (_req, res) => {
  return res.json(api);
})

app.listen(port, () => {
  console.log(`Escutando na porta ${port}`);
});
