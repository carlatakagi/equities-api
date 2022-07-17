const express = require('express');
const app = express();

const api = require('./src/data/api.json');

const port = process.env.PORT || 3000;

app.get('/equities', (req, res) => {
  return res.json(api);
})

app.listen(port, () => {
  console.log(`Escutando na porta ${port}`);
});
