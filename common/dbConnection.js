const mongoose = require('mongoose')

// const dbConnection  = () => {

//     mongoose.connect(process.env.DB_CONNECTION);

//     var db = mongoose.connection;
//     db.on('error', console.error.bind(console, 'connection error:'));
//     db.once('open', function callback () {
//         console.log(process.env.DB_CONNECTION);
//     });

// }

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_CONNECTION);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

module.exports = connectDB;