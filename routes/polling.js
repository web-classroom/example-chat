/* eslint-disable  */
const express = require('express');

const router = express.Router();
const inboxes = new Map();

/* user page */
router.get('/:user', (req, res) => {
  res.render('polling', { user: req.params.user });
});

/* save message */
router.post('/:user/messages', (req, res) => {
  const { user } = req.params;
  const content = req.body.message;
  const message = { user, content };
  if (!inboxes.has(user)) {
    inboxes.set(user, []);
  }
  for (let inbox of inboxes.values()) {
    inbox.push(message);
  }
  res.json(message);
});

/* poll messages */
router.get('/:user/messages', function (req, res) {
  let user = req.params.user;
  if (!inboxes.has(user)) {
    inboxes.set(user, []);
  }
  let messages = inboxes.get(user);
  inboxes.set(user, []);
  res.json(messages.reverse());
});

module.exports = router;