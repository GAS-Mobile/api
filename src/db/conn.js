require('dotenv').config()
const mongoose = require('mongoose');

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD 
const databaseURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.f5syrxp.mongodb.net/?retryWrites=true&w=majority`

const main = async () => {
  await mongoose.connect(databaseURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  }).then(() => 
    console.log('Connected to database succesfully')
  ).catch((error) => 
    console.log(error)
  )
}

module.exports = main