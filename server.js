// eslint-disable-next-line no-unused-vars
require('dotenv').config();
const http = require('http');
const app = require('./app');

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(Number.port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // eslint-disable-next-line
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${bind}`);
});

server.listen(port);
