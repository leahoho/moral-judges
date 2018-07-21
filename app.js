var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
// const passport = require('passport');
const passport = require('./auth/local');
const hb = require('express-handlebars');
const fileUpload = require('express-fileupload');

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    database: 'db1',
    user: 'postgres',
    password: 'mj',
  },
});

const authHelpers = require('./auth/_helpers');

app.use(express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(fileUpload());
app.use(
  session({
    secret: 'moral_secret!@#$',
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());
app.engine('handlebars', hb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// app.post('/register', (req, res) => {
//   console.log(req.body);
//   knex
//     .insert({
//       username: req.body.username,
//       password: req.body.password,
//       email: req.body.email,
//     })
//     .into('users')
//     .then(() => {
//       res.redirect('/posts'); //form is redirect as a get request
//     })
//     .catch(err => console.log('opppspsspsps', err));
// });

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      handleResponse(res, 500, 'error');
    }
    if (!user) {
      handleResponse(res, 404, 'User not found');
    }
    if (user) {
      req.logIn(user, function(err) {
        if (err) {
          handleResponse(res, 500, 'error');
        }
        // handleResponse(res, 200, 'success');
        res.redirect('/posts');
      });
    }
  })(req, res, next);
});

app.post('/register', (req, res, next) => {
  return authHelpers
    .createUser(req, res)
    .then(response => {
      passport.authenticate('local', (err, user, info) => {
        if (user) {
          handleResponse(res, 200, 'success');
        }
      })(req, res, next);
    })
    .catch(err => {
      handleResponse(res, 500, 'error');
    });
});

function handleResponse(res, code, statusMsg) {
  res.status(code).json({ status: statusMsg });
}

// app.get('/logout', (req, res) => {
//   res.render('login');
// });

app.get('/logout', authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  handleResponse(res, 200, 'success');
});

app.get('/posts', authHelpers.loginRequired, (req, res) => {
  // console.log('req user: ', req.user);
  knex('posts')
    .select()
    .then(posts => {
      // console.log(posts[0]);
      res.render('posts', { posts: posts });
    });
  /////```````inner join / groupby
  // const p1 =
  //     knex
  //         .select('*')
  //         .from('posts')
  //         .innerJoin('votes', 'votes.post_id', 'posts.id')
  //         .then(posts => {
  //             console.log(posts[0]);
  //         });
  // const p2 =
  //     knex
  //         .select('*')
  //         .from('posts')
  //         .innerJoin('advices', 'advices.post_id', 'posts.id')
  //         .then(advices => {
  //             console.log(advices[0]);
  //         });
  // Promise.all([p1, p2])
  //     .then(values => console.log(values))
  //     .then(()=>{res.render('posts', { posts: posts, advices: advices });})
  //     .catch(err => console.log(err));
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  if (typeof id != 'undefined') {
    knex('posts')
      .select()
      .where('id', id)
      .then(details => {
        console.log(details);
        res.render('postdetails', { details: details[0] });
      })
      .catch(err => console.log('opppspsspsps', err));
  } else {
    res.status(500);
    res.render('error', {
      message: 'Invalid id, no this users',
    });
  }
});

//// POST route of adding advice(comments)
////?? why cant get advice content in postdetails.handlebars???(console.log show "undefined", may be coz no data(eg userid) in db, may needa wait til authen gor bin gao dim)
// app.post("/posts/:id", (req, res) => {
//     console.log(req.body);
//     knex.insert({ content: req.body.advicecontent }).into("advices")
//         .then(() => {
//             res.redirect("/mypostlist");
//         }).catch(err => console.log("opppspsspsps", err))
// });

//// POST route of storing the support or not value
// app.post("/posts/:id/supportornot", (req, res) => {
//     const id = req.params.id;
//     knex.insert({ victim: "false", content: "content" }).into("votes")
//         .then(() => {
//             res.redirect("/posts"); //form is redirect as a get request
//         }).catch(err => console.log("opppspsspsps", err))
// });

app.get('/role', (req, res) => {
  res.render('role');
});

app.get('/badass', authHelpers.loginRequired, (req, res) => {
  res.render('badasscreate');
});

app.get('/victim', (req, res) => {
  res.render('victimcreate');
});

app.get('/mypostlist', (req, res) => {
  knex('posts')
    .select()
    .then(posts => {
      res.render('mypostlist', { posts: posts });
    });
});

app.get('/myadvice', (req, res) => {
  res.render('myadvice');
});

app.get('/myfavourite', (req, res) => {
  knex('posts')
    .select()
    .then(posts => {
      res.render('myfavourite', { posts: posts });
    });
});

app.post('/upload', (req, res) => {
  if (!req.files) return res.status(400).send('No files were uploaded.');

  let inputFile = req.files.inputFile;
  const filePath = 'images/' + inputFile.name;
  inputFile.mv(filePath, function(err) {
    if (err) return res.status(500).send(err);

    // console.log('upload req user: ', req.user);

    const data = {
      title: req.body.title,
      content: req.body.content,
      image_path: filePath,
      user_id: req.user.id,
      // datetime: Date.now(),
    };

    // console.log("data: ", data);
    //write path to database

    knex
      .insert(data)
      .into('posts')
      .then(() => {
        res.redirect('/posts');
      })
      .catch(err => {
        console.log('insert post error: ', err);
        res.redirect('/posts');
      });
  });
});

// app.post('/posts', (req, res) => {
//   console.log(req.body);
//   knex
//     .insert({
//       title: req.body.title,
//       image_path: req.body.image,
//       victim: req.body.trueorfalse,
//       content: req.body.content,
//     })
//     .into('posts')
//     .then(() => {
//       res.redirect('/posts');
//     })
//     .catch(err => console.log('opppspsspsps', err));
// });

app.listen(3000);
