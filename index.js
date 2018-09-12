const express = require('express');
const app = express();
const genres=require('./routes/genres');

const genresEndPoint = '/api/genres';

app.use(express.json());
app.use(genresEndPoint,genres);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Lestining to port ${port}.....`));