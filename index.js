const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  console.log(process.env.API_KEY);
});

const port = 3000;
app.listen(port, () => {
   console.log(`Server listening on port ${port}`);
});
