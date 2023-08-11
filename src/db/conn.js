const mongoose = require('mongoose');

const databaseURI = 'mongodb://127.0.0.1:27017/gas'

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