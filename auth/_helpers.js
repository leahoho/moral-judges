const bcrypt = require('bcryptjs');
const knex = require('knex')({
  client: 'postgresql',
  connection: {
    database: 'db1',
    user: 'postgres',
    password: 'mj',
  },
});

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return knex('users')
    .insert({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    })
    .returning('*');
}

function loginRequired(req, res, next) {
  // if (!req.user) return res.status(401).json({ status: 'Please log in' });
  if (!req.user) return res.redirect('/login');
  return next();
}

module.exports = {
  comparePass,
  createUser,
  loginRequired,
};
