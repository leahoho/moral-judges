var express = require("express");
const hb = require("express-handlebars");
const fileUpload = require("express-fileupload");
var app = express();

var bodyParser = require("body-parser");
app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
<<<<<<< HEAD

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


=======
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
>>>>>>> master

// array put here to be global
var posts = [
  {
    title: "Post1Title",
    content: "Post1Content",
    image:
      "https://mediaassets.news5cleveland.com/photo/2017/03/16/Dog%201_1489684235019_56950050_ver1.0_640_480.jpg"
  },
  {
    title: "Post2Title",
    content: "Post2Content",
    image:
      "https://i.startsatsixty.com.au/wp-content/uploads/20170519045723/broken-wine-glass-170518-720x379.jpg"
  },
  {
    title: "Post3Title",
    content: "Post3Content",
    image:
      "https://media.swncdn.com/cms/CW/faith/25331-man-guy-praying-silhouette-sunset-sunrise-ground-kneeling-wide.1200w.tn.jpg"
  },
  {
    title: "Post4Title",
    content: "Post4Content",
    image:
      "https://i2.cdn.turner.com/money/dam/assets/130628144732-bullying-fine-1024x576.jpg"
  },
  {
    title: "Post5Title",
    content: "Post5Content",
    image:
      "http://channelingerik.com/wp-content/uploads/2017/12/404405-1391126768-wide-600x300.jpg"
  },
  {
    title: "Post6Title",
    content: "Post6Content",
    image:
      "http://www.bravotv.com/sites/nbcubravotv/files/styles/blog-post--mobile/public/field_blog_image/2016/10/personal-space-how-to-survive-an-affair.jpg?itok=cAVAQ736&timestamp=1476122695"
  },
  {
    title: "Post7Title",
    content: "Post7Content",
    image:
      "https://i.ndtvimg.com/i/2017-07/cheating-exam-istock_650x400_81500877506.jpg"
  },
  {
    title: "Post8Title",
    content: "Post8Content",
    image:
      "http://s3.amazonaws.com/wellness-everyday/media/265/minisite/bullying-fotonovela-cvr-photo.jpg?1459289469"
  },
  {
    title: "Post9Title",
    content: "Post9Content",
    image:
      "https://thumbs.dreamstime.com/b/pickpocket-action-to-take-money-portrait-thief-wearing-mask-jacket-taking-pocket-woman-54819507.jpg"
  },
  {
    title: "Post10Title",
    content: "Post10Content",
    image:
      "https://secure.i.telegraph.co.uk/multimedia/archive/01487/Duct-tape-cat_1487802c.jpg"
  }
];

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  // moved the array outside, to make it global//
  res.render("register");
});

app.get("/logout", (req, res) => {
  res.render("login");
});

// show u all the posts
app.get("/posts", (req, res) => {
  // moved the array outside, to make it global//
  res.render("posts", { posts: posts });
});

//route that u can create a new post
app.post("/posts", (req, res) => {
  //***take the form data, do sth wif it, then redirect to another route
  //get data from form and add to posts array
  var title = req.body.title;
  var content = req.body.content;
  var image = req.body.image;
  var newPost = { title: title, content: content, image: image }; // create a variable holding an object
  posts.push(newPost);
  //redirect back to posts page
  res.redirect("/posts"); //form is redirect as a get request
});

app.get("/role", (req, res) => {
  res.render("role");
});

//show the form that would send the data to the above post route
app.get("/badass", (req, res) => {
  res.render("badasscreate");
});

app.get("/victim", (req, res) => {
  res.render("victimcreate", { layout: "b" });
});

app.get("/mypostlist", (req, res) => {
  res.render("mypostlist");
});

app.get("/myadvice", (req, res) => {
  res.render("myadvice");
});

app.get("/myfavourite", (req, res) => {
  res.render("myfavourite");
});

app.use(fileUpload());

app.post("/upload", function(req, res) {
  if (!req.files) return res.status(400).send("No files were uploaded.");

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv("/somewhere/on/your/server/filename.jpg", function(err) {
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });
});

app.listen(3000);
