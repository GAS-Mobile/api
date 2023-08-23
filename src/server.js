require('dotenv').config()

const express = require('express');
const cors = require('cors');
const dbConnection = require('./db/conn');
const routes = require('./routes/router');

const PORT = process.env.PORT;
const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/v1/', routes)

dbConnection()

app.listen(PORT, () => console.log(`listening on port:${PORT}`));