const EventEmitter = require('events');
const express = require('express');

const router = express.Router();

const chat = new EventEmitter();

/* user page */
router.get('/:user/', (req, res) => {
  res.render('sse', { user: req.params.user });
});

/* save message */
router.post('/:user/messages', (req, res) => {
  const { user } = req.params;
  const content = req.body.message;
  const message = { user, content };
  chat.emit('message', message);
  res.json(message);
});

/* server-side events */
router.get('/:user/messages', (req, res) => {
  res.status(200);
  res.set('Content-Type', 'text/event-stream');
  res.set('Transfer-Encoding', 'chunked');
  const listener = (message) => res.write(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
  chat.on('message', listener);
  res.on('close', () => chat.removeListener('message', listener));
});

module.exports = router;
