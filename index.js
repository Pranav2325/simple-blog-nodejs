import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;



let posts = [];
let postIdCounter = 0;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");



app.get("/", (req, res) => {
  res.render("home", { posts: posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = {
    id: postIdCounter++,
    title: req.body.postTitle,
    content: req.body.postContent
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/post/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find(p => p.id === postId);

  if (post) {
    res.render("post", {
      id: post.id,
      title: post.title,
      content: post.content
    });
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/edit/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find(p => p.id === postId);

  if (post) {
    res.render("edit", {
      id: post.id,
      title: post.title,
      content: post.content
    });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/edit/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find(p => p.id === postId);

  if (post) {
    post.title = req.body.postTitle;
    post.content = req.body.postContent;
    res.redirect("/post/" + postId);
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/delete/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const exists = posts.find(p => p.id === postId);

  if (exists) {
    posts = posts.filter(p => p.id !== postId);
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
