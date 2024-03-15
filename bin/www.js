const app = require('../express.js');
const log = require('../models/log.js');
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const http = require("http");

const port = process.env.PORT || process.env.PORT_NODE;
app.set('port', port);

const server = http.createServer(app);

mongoose.connect(process.env.MONGO_URL).then(() => {

     log.info("Successfully connected to the database");
     server.listen(port);
 
     server.on('error', onError);
     server.on('listening', onListening);

}).catch(err => {
     log.error("An error occurred while connecting to the database: " + err);
     process.exit(1);
});

cloudinary.config({
     cloud_name: process.env.CLOUDINARY_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
});

function onError(error) {
     switch (error.code) {
          case 'EACCES':
               log.error('Port ' + error.port + ' requires elevated privileges');
               process.exit(1);
               break;

          case 'EADDRINUSE':
               log.error('Port ' + error.port + ' is already in use');
               process.exit(1);
               break;
               
          default:
               log.error('An error occurred: ' + error.code);
               process.exit(1);
     };
};

function onListening() {
     log.info('HTTP servers listening on port ' + port);
};