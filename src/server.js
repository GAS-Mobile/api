require('dotenv').config()

const express = require('express');
const cors = require('cors');
const dbConnection = require('./utils/databaseConnection');
const routes = require('./routes/router');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./documentation/swagger-output.json')

const PORT = process.env.PORT;
const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/v1/', routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

dbConnection()

app.listen(PORT, () => console.log(`listening on port:${PORT}`));