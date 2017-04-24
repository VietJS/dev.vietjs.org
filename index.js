const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const randomID = require("random-id");
const clients = {};

app.enable('trust proxy');
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.all('/r/:rId', function (req, res) {
  io.emit('bin_' + req.params.rId, {
    url: req.originalUrl,
    type: req.headers['content-type'],
    method: req.method,
    time: +new Date,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    size: req.socket.bytesRead
  });
  res.send('OK');
});

app.get('/create-bin', function (req, res) {
  const binId = randomID(8, 'aA0');
  res.redirect(`/r/${binId}/inspect`);
});

app.get('/r/:rId/inspect', function (req, res) {
  res.sendFile(path.resolve('./public/index.html'));
});

io.on('connection', function (socket) {
  console.log(`Socket.io new connection! ${socket.id}`);

  io.to(socket.id).on('createBin', function () {
    const binId = randomID(8, 'aA0');
    console.log('[createBin]', binId);
    io.to(socket.id).emit('binId', binId);
  });
});

server.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
});
