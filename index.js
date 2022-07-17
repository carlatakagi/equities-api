const express = require('express');

const app = express();

const port = 3000;

app.get('/', (_req, res) => {
  return res.json({message: 'api está funcionando'});
})

app.listen(port, () => {
  console.log(`Escutando na porta ${port}`);
});
