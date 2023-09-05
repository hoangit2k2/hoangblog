const mongoose = require('mongoose');

const conncectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connect host: ${conn.connection.host} successfully`);
    } catch (error) {
        console.log(error);
    }
};

module.exports = conncectDB;
