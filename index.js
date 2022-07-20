const express = require('express');
const cors = require('cors');
const app = express();

const data = require('./src/data/api.json');

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/cliente/ativos/:codCliente', (req, res) => {
  const { codCliente } = req.params;
  const filteredData = data.filter((equity) => Number(codCliente) === equity.CodCliente)
  return res.json(filteredData);
})

app.post('/investimentos/comprar', (_req, res) => {
  return res.json(data);
})

app.post('/investimentos/vender', (_req, res) => {
  return res.json(data);
})

app.listen(port, () => {
  console.log(`Escutando na porta ${port}`);
});
