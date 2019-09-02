const express = require('express');

const server = express();

server.use(express.json());

const users = ['Gustavo', 'Diego'];

server.use((req, res, next) => {
  console.time('Required');
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Required');
});

function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  return next();
}

server.get('/users', (req, res) => {
  return res.json(users);
});

server.get('/users/:index', checkUserArray, (req, res) => {
  const { index } = req.params;
  return res.json(users[index]);
});

server.post('/users', checkUserExist, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserArray, checkUserExist, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
});

server.listen(3000);
