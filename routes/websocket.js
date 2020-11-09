const EventEmitter = require('events');
const express = require('express');
const expressWs = require('express-ws');

const router = express.Router();
expressWs(router);

const chat = new EventEmitter();

/* user page */
router.get('/:user', (req, res) => {
  res.render('websocket', { user: req.params.user });
});

/* websocket */
router.ws('/:user/messages', (ws, req) => {
  const { user } = req.params;
  ws.on('message', (content) => {
    const message = { user, content };
    chat.emit('message', message);
  });
  const listener = (message) => ws.send(JSON.stringify(message));
  chat.on('message', listener);
  ws.on('close', () => chat.removeListener('message', listener));
});

module.exports = router;
