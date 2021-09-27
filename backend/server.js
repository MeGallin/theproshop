import express from 'express';
import dotenv from 'dotenv';
import products from './data/products.js';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running');
});
app.get('/api/products', (req, res) => {
  res.json(products);
});
app.get('/api/products/:id', (req, res) => {
  const product = products.find((product) => product._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;

app.listen(
  PORT,
  console.log(`Server running on port ${PORT} and running in ${MODE} mode.`),
);
