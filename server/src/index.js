import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import createDebug from 'debug';
import ms from 'ms';

const debug = createDebug('u-wave-index');

const servers = new Map();

const app = express();
app.use(bodyParser.json());

app.options(cors());
app.use(cors());

app.post('/announce', (req, res) => {
  servers.set(req.ip, {
    ping: Date.now(),
    data: req.body
  });

  debug('announce', req.ip);

  res.json({ received: servers.get(req.ip).data });
});

app.get('/', (req, res) => {
  const response = [];
  servers.forEach((value) => {
    response.push(value.data);
  });
  res.json({ servers: response });
});

// Cleanup
setInterval(() => {
  debug('prune');
  servers.forEach((server, ip) => {
    if (server.ping + ms('5 minutes') < Date.now()) {
      debug('prune', ip);
      servers.delete(ip);
    }
  });
}, ms('1 minute'));

app.listen(6451);
