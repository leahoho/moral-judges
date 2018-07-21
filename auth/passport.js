const passport = require('passport');

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    database: 'db1',
    user: 'postgres',
    password: 'mj',
  },
});

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    knex('users')
      .where({ id })
      .first()
      .then(user => {
        // console.log('found user: ', user);
        done(null, user);
      })
      .catch(err => {
        console.log('err: ', err);
        done(err, null);
      });
  });
};
