const express = require('express');
const cors = require('cors');
const dbConnection = require('./db/conn');

const PORT = 3000;
const app = express();

app.use(cors())
app.use(express.json())

dbConnection()

app.listen(PORT, () => console.log(`listening on port:${PORT}`));