const mongo = require('./utils/connection');
const config = require('./utils/config');
const app = require('./app');
const http = require('http');
const log = require('./utils/log');
const server = http.createServer(app);

mongo.connectDB.then(() => {
    server.listen(config.PORT, () => {
        log.info(`Server is running on port ${config.PORT} \n`);
    });

}, e => log.info(e))
    .catch(e =>
        log.info(e)
    )
