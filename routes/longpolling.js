const express = require('express');
const EventEmitter = require('events');

const router = express.Router();
const chat = new EventEmitter();

/* user page */
router.get('/:user/', (req, res) => {
  res.render('longpolling', { user: req.params.user });
});

/* save message */
router.post('/:user/messages', (req, res) => {
  const { user } = req.params;
  const content = req.body.message;
  const message = { user, content };
  chat.emit('message', message);
  res.json(message);
});

/* long polling */
router.get('/:user/messages', (req, res) => {
  const listener = (message) => res.json(message);
  chat.on('message', listener);
  res.on('close', () => chat.removeListener('message', listener));
});

module.exports = router;
