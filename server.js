const app = require('./app');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

// if port is not defined in .env, the value will be 3000
const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);

// console-log it just once (so i know server is listening on defined port)
server.once('listening', () => {
  console.info(`Started server on port http://localhost:${port}`);
});
