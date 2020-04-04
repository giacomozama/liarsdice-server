import logger from './logger.js';
import http from 'http';

import GlobalState from './models/GlobalState.js';
import Socket from './events/Socket.js';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end('<h1>Hello World</h1>');
});

const io = Socket(server);

const listen = (hostname, port) => {

  server.listen(port, hostname, () => {
    logger.info(`Server running at http://${hostname}:${port}/`);
  });

  process.once('SIGUSR2', function () {
    server.close(function () {
      process.kill(process.pid, 'SIGUSR2')
    })
  });
}

export default {
  'server': server,
  'io': io,
  'state': GlobalState,
  'logger': logger,

  'listen': listen,
}