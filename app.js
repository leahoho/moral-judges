var express = require("express");
var app = express();

var cookieParser = require("cookie-parser");
var session = require("express-session");
const passport = require("./auth/local");
const hb = require("express-handlebars");
const fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");

const knex = require("knex")({
  client: "postgresql",
  connection: {
    database: "db1",
    user: "postgres",
    password: "mj"
  }
});

//import auth function
const authHelpers = require("./auth/_helpers");

//beginning of backend

//set static files
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/public"));

//middleware
app.use(fileUpload());

//configure auth settings
app.use(
  session({
    secret: "moral_secret!@#$",
    resave: false,
    saveUninitialized: true
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

//beginning of routes
app.get("/", (req, res) => {
  res.render("login", { layout: "mainmeilogin.handlebars" });
});

app.get("/login", (req, res) => {
  res.render("login", { layout: "mainmeilogin.handlebars" });
});

app.get("/register", (req, res) => {
  res.render("register", { layout: "mainmeilogin.handlebars" });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      handleResponse(res, 500, "error");
    }
    if (!user) {
      // handleResponse(res, 404, "User not found");
      res.render("loginfail");
    }
    if (user) {
      req.logIn(user, function(err) {
        if (err) {
          handleResponse(res, 500, "error");
          // res.render("/loginfail");
        }
        // handleResponse(res, 200, 'success');
        res.redirect("/posts");
      });
    }
  })(req, res, next);
});

app.post("/register", (req, res, next) => {
  return authHelpers
    .createUser(req, res)
    .then(response => {
      passport.authenticate("local", (err, user, info) => {
        if (user) {
          // handleResponse(res, 200, "success");
          res.redirect("/posts");
        }
      })(req, res, next);
    })
    .catch(err => {
      // handleResponse(res, 500, "error");
      res.redirect("/registerfail");
    });
});

function handleResponse(res, code, statusMsg) {
  res.status(code).json({ status: statusMsg });
}

app.get("/logout", authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  res.render("login", { layout: "mainmeilogin.handlebars" });
});

//s
app.get("/posts", authHelpers.loginRequired, (req, res) => {
  knex
    .count("advices.post_id")
    .column(
      "posts.id",
      "posts.user_id",
      "image_path",
      "victim",
      "title",
      "posts.content",
      "posts.created_at"
    )
    .from("posts")
    .leftJoin("advices", "advices.post_id", "posts.id")
    .groupBy("posts.id")
    .orderBy("posts.created_at", "aesc")
    .then(posts => {
      res.render("posts", { posts: posts });
    });
});
//s
app.get("/postssortnewold", authHelpers.loginRequired, (req, res) => {
  knex
    .count("advices.post_id")
    .column(
      "posts.id",
      "posts.user_id",
      "image_path",
      "victim",
      "title",
      "posts.content",
      "posts.created_at"
    )
    .from("posts")
    .leftJoin("advices", "advices.post_id", "posts.id")
    .groupBy("posts.id")
    .orderBy("posts.created_at", "desc")
    .then(posts => {
      res.render("posts", { posts: posts });
    });
});
//s
app.get("/postssortvic", authHelpers.loginRequired, (req, res) => {
  knex
    .count("advices.post_id")
    .column(
      "posts.id",
      "posts.user_id",
      "image_path",
      "victim",
      "title",
      "posts.content",
      "posts.created_at"
    )
    .from("posts")
    .leftJoin("advices", "advices.post_id", "posts.id")
    .groupBy("posts.id")
    .orderBy("victim", "desc")
    .then(posts => {
      res.render("posts", { posts: posts });
    });
});
//s
app.get("/postssortcri", authHelpers.loginRequired, (req, res) => {
  knex
    .count("advices.post_id")
    .column(
      "posts.id",
      "posts.user_id",
      "image_path",
      "victim",
      "title",
      "posts.content",
      "posts.created_at"
    )
    .from("posts")
    .leftJoin("advices", "advices.post_id", "posts.id")
    .groupBy("posts.id")
    .orderBy("victim", "aesc")
    .then(posts => {
      res.render("posts", { posts: posts });
    });
});
//s
app.get("/postssortdoradv", authHelpers.loginRequired, (req, res) => {
  knex
    .count("advices.post_id")
    .column(
      "posts.id",
      "posts.user_id",
      "image_path",
      "victim",
      "title",
      "posts.content",
      "posts.created_at"
    )
    .from("posts")
    .leftJoin("advices", "advices.post_id", "posts.id")
    .groupBy("posts.id")
    .orderByRaw("count(advices.post_id) desc")
    .then(posts => {
      res.render("posts", { posts: posts });
    });
});

app.get("/postssortsiuadv", authHelpers.loginRequired, (req, res) => {
  knex
    .count("advices.post_id")
    .column(
      "posts.id",
      "posts.user_id",
      "image_path",
      "victim",
      "title",
      "posts.content",
      "posts.created_at"
    )
    .from("posts")
    .leftJoin("advices", "advices.post_id", "posts.id")
    .groupBy("posts.id")
    .orderByRaw("count(advices.post_id)")
    .then(posts => {
      res.render("posts", { posts: posts });
    });
});

//update post details
app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const post = await knex("posts").where("id", id);
  const allAdvices = await knex("advices").where("post_id", id);

  Promise.all([post, allAdvices])
    .then(results => {
      res.render("postdetails", {
        details: results[0][0],
        advices: results[1]
      });
    })
    .catch(err => console.log("opppspsspsps", err));
});

app.get("/role", (req, res) => {
  res.render("role");
});

app.get("/badass", authHelpers.loginRequired, (req, res) => {
  res.render("badasscreate");
});

app.get("/victim", authHelpers.loginRequired, (req, res) => {
  res.render("victimcreate");
});

app.get("/mypostlist", authHelpers.loginRequired, (req, res) => {
  knex("posts")
    .where("posts.user_id", req.user.id)
    .count("advices.post_id")
    .column(
      "posts.id",
      "posts.user_id",
      "image_path",
      "victim",
      "title",
      "posts.content",
      "posts.created_at"
    )
    .leftJoin("advices", "advices.post_id", "posts.id")
    .groupBy("posts.id")
    .orderBy("posts.created_at", "aesc")
    .then(posts => {
      res.render("posts", { posts: posts });
    });
});

app.get("/myadvice", authHelpers.loginRequired, (req, res) => {
  knex("advices")
    .where("user_id", req.user.id)
    .then(advices => {
      res.render("myadvice", { advices: advices });
    });
});

app.post("/comment", authHelpers.loginRequired, (req, res) => {
  const data = {
    content: req.body.content,
    user_id: req.user.id,
    post_id: parseInt(req.body.postId)
  };
  knex
    .insert(data)
    .into("advices")
    .then(() => {
      res.redirect("/posts/" + req.body.postId);
    })
    .catch(err => {
      console.log("insert advice error: ", err);
      res.redirect("/posts/" + req.body.postId);
    });
});

app.get("/infoxxx", (req, res) => {
  res.render("info", { layout: "infomeilogin.handlebars" });
});

app.get("/info", (req, res) => {
  res.render("info");
});

// app.get("/myfavourite", (req, res) => {
//   knex("posts")
//     .select()
//     .then(posts => {
//       res.render("myfavourite", { posts: posts });
//     });
// });

//upload & post function
app.post("/upload", (req, res) => {
  if (!req.files) return res.status(400).send("No files were uploaded.");

  let inputFile = req.files.inputFile;
  if (inputFile != null) {
    const filePath = "images/" + inputFile.name;
    inputFile.mv(`${__dirname}/public/${filePath}`, function(err) {
      if (err) return res.status(500).send(err);

      const data = {
        title: req.body.title,
        content: req.body.content,
        image_path: filePath,
        user_id: req.user.id,
        victim: req.body.victim || false
      };

      knex
        .insert(data)
        .into("posts")
        .then(() => {
          res.redirect("/posts");
        })
        .catch(err => {
          console.log("insert post error: ", err);
          res.redirect("/posts");
        });
    });
  } else {
    const data = {
      title: req.body.title,
      content: req.body.content,
      image_path: null,
      user_id: req.user.id,
      victim: req.body.victim || false
    };

    knex
      .insert(data)
      .into("posts")
      .then(() => {
        res.redirect("/posts");
      })
      .catch(err => {
        console.log("insert post error: ", err);
        res.redirect("/posts");
      });
  }
});

app.listen(3000);

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
