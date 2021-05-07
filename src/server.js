// Modules
const express = require('express');
const app = express();
const PORT = 5000;

const routes = require('./routes/router');

// Middlewares
app.use(express.json());
app.use(routes);
app.use((req, res) => { 
  res.status(404).send({
    message: 'Resource not found',
  });
});

app.use((req, res) => {
  res.send('OK');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});