import express from 'express';
import bodyParser from 'body-parser';
import ms from 'ms';

const servers = new Map();

const app = express();
app.use(bodyParser.json());

app.post('/announce', (req, res) => {
  servers.set(req.ip, {
    ping: Date.now(),
    data: req.body
  });
  res.end({ received: servers.get(req.ip).data });
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
  servers.forEach((server, ip) => {
    if (server.ping + ms('5 minutes') < Date.now()) {
      servers.delete(ip);
    }
  });
}, 60 * 1000);

app.listen(6451);
