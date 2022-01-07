const config = require('./config');
const mongoose = require('mongoose');

const connectDB = mongoose.connect(`${config.MONGODB_KEY_URI}`, {
//    keepAlive: true,
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
//    useFindAndModify: true,
//    sslValidate:true,
//    checkServerIdentity:false,
//    sslCert: fs.readFileSync("/etc/ssl/ca.crt"),
//    tlsAllowInvalidCertificates: true,
//    tlsAllowInvalidHostnames: true,
//    tlsCAFile: `${config.SSL}`,
//    tlsAllowInvalidHostnames: true
}).then(() => {
    console.log('---------------------------------');
    console.log("----- Connected to MongoDB! -----");
    console.log('---------------------------------\n')
})

module.exports = {
    connectDB,
}
