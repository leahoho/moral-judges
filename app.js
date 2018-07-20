var express = require('express');
var app = express();
const hb = require('express-handlebars');

const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: "db1",
        user: "mj",
        password: "mj"
    }
});

var bodyParser = require("body-parser");
app.engine('handlebars', hb({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// var posts = [
//     {title: "Post1Title", content: "Post1Content", image:"https://mediaassets.news5cleveland.com/photo/2017/03/16/Dog%201_1489684235019_56950050_ver1.0_640_480.jpg"},
//     {title: "Post2Title", content: "Post2Content", image:"https://i.startsatsixty.com.au/wp-content/uploads/20170519045723/broken-wine-glass-170518-720x379.jpg"},
//     {title: "Post3Title", content: "Post3Content", image:"https://media.swncdn.com/cms/CW/faith/25331-man-guy-praying-silhouette-sunset-sunrise-ground-kneeling-wide.1200w.tn.jpg"},
//     {title: "Post4Title", content: "Post4Content", image:"https://i2.cdn.turner.com/money/dam/assets/130628144732-bullying-fine-1024x576.jpg"},
//     {title: "Post5Title", content: "Post5Content", image:"http://channelingerik.com/wp-content/uploads/2017/12/404405-1391126768-wide-600x300.jpg"},
//     {title: "Post6Title", content: "Post6Content", image:"http://www.bravotv.com/sites/nbcubravotv/files/styles/blog-post--mobile/public/field_blog_image/2016/10/personal-space-how-to-survive-an-affair.jpg?itok=cAVAQ736&timestamp=1476122695"},
//     {title: "Post7Title", content: "Post7Content", image:"https://i.ndtvimg.com/i/2017-07/cheating-exam-istock_650x400_81500877506.jpg"},
//     {title: "Post8Title", content: "Post8Content", image:"http://s3.amazonaws.com/wellness-everyday/media/265/minisite/bullying-fotonovela-cvr-photo.jpg?1459289469"},
//     {title: "Post9Title", content: "Post9Content", image:"https://thumbs.dreamstime.com/b/pickpocket-action-to-take-money-portrait-thief-wearing-mask-jacket-taking-pocket-woman-54819507.jpg"},
//     {title: "Post10Title", content: "Post10Content", image:"https://secure.i.telegraph.co.uk/multimedia/archive/01487/Duct-tape-cat_1487802c.jpg"}
// ]

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    console.log(req.body);
    knex.insert({ username: req.body.username, password: req.body.password, email: req.body.email }).into("users")
        .then(() => {
            res.redirect("/posts"); //form is redirect as a get request
        }).catch(err => console.log("opppspsspsps", err))
});


app.get('/logout', (req, res) => {
    res.render('login');
});


app.get('/posts', (req, res) => {
    knex('posts')
        .select()
        .then(posts => {
            console.log(posts[0]);
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


app.post("/posts", (req, res) => { 
    console.log(req.body);
    knex.insert({ title: req.body.title, image_path: req.body.image, victim:req.body.trueorfalse, content: req.body.content }).into("posts")
        .then(() => {
            res.redirect("/posts"); 
        }).catch(err => console.log("opppspsspsps", err))
});



app.get("/posts/:id", (req, res) => {
    const id = req.params.id;
    if (typeof id != 'undefined') {
        knex('posts')
            .select()
            .where('id', id)
            .then(details => {
                console.log(details);
                res.render('postdetails', { details: details[0] });
            }).catch(err => console.log("opppspsspsps", err))
    } else {
        res.status(500);
        res.render('error', {
            message: 'Invalid id, no this users'
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

app.get("/role", (req, res) => {
    res.render("role");
});


app.get("/badass", (req, res) => {
    res.render("badasscreate");
});

app.get("/victim", (req, res) => {
    res.render("victimcreate");
});

app.get("/mypostlist", (req, res) => {
    knex('posts')
        .select()
        .then(posts => {
            res.render('mypostlist', { posts: posts });
        });
});

app.get("/myadvice", (req, res) => {
    res.render("myadvice");
});

app.get("/myfavourite", (req, res) => {
    knex('posts')
        .select()
        .then(posts => {
            res.render('myfavourite', { posts: posts });
        });
});





app.listen(3000);
