//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const { default: mongoose } = require("mongoose");
const homeStartingContent = "Welcome to The Daily Scribble, where words come alive! We're a blog that's dedicated to bringing you daily doses of inspiration, insights, and ideas. Our mission is to provide you with a space to explore your creativity, cultivate your writing skills, and share your thoughts with the world. Whether you're a seasoned writer or a beginner, we believe that everyone has a story to tell and a unique perspective to share. So, join us on this journey of self-discovery and expression, and let your imagination run wild!";
const aboutContent = "Hello there! My name is Rohan Nayan and I am a Computer Science student at VIT Vellore. I am an avid gamer, music lover, and coding enthusiast. I also enjoy playing football in my free time. I created The Daily Scribble as a platform to share my thoughts and ideas with others. Through this blog, I hope to provide readers with a space to explore their creativity, learn something new every day, and connect with like-minded individuals. I am passionate about technology and its applications in our daily lives, and I believe that writing can be a powerful tool to inspire, inform, and transform. Thank you for visiting The Daily Scribble, and I hope you enjoy your time here!";
const contactContent = "If you have any questions or comments, please feel free to reach out to me! You can contact me at rohannayan405@gmail.com. I am also active on LinkedIn, Twitter(@nayan_rohan), and GitHub, where you can connect with me and stay updated on my latest projects and interests. Don't hesitate to drop me a message or follow me on these platforms - I would love to hear from you and connect with like-minded individuals. Thank you for your interest in my work, and I look forward to hearing from you soon!"
const app = express();
const connection = mongoose.createConnection(`mongodb+srv://rohannayan405:rohannayan405@cluster0.mlrfqzu.mongodb.net/blogDB`)


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//DataBase
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  postImg: String
})

const Post = connection.model("Post", postSchema);

const appID = "VVNdfqTZCwEWhLK3ndRLr0lYlUAC06lzsnXiS41Xaqs";

//Home Page
app.get("/", async function(req,res){
  const quote = await getQuote();
  Post.find({}).then(posts=>{
    res.render("home", {startingContent: homeStartingContent, newPosts: posts, Quote:quote[0], author:quote[1]});
  })
});

//About Page
app.get("/about", function(req, res){
  res.render("about", {about: aboutContent});
});

//Contact Page
app.get("/contact", function(req, res){
  res.render("contact", {contact: contactContent});
});

//Compose Page

app.get('/compose', function(req, res){
  res.render("compose");
});

app.post('/compose', async function(req,res){
  const img = await getImg(req.body.newContentTitle);
  const post = new Post({
    title: req.body.newContentTitle,
    content: req.body.newContent,
    postImg: img
  });
  post.save().then(function(){
    res.redirect('/');
  });
});

//API for post's images
async function getImg(title){
  const response= await fetch("https://api.unsplash.com/search/photos?query="+title+"&client_id="+appID);
  // console.log(response);
  const data = await response.json();
  // console.log(data);
  img = data.results[0].urls.full;
  // console.log(img);
  return img;
}

//API for quotes
async function getQuote(){
  const response = await fetch("https://zenquotes.io?api=random")
  const data = await response.json();
  const quote = [data[0].q,data[0].a];
  return quote;
}

//Posts Page
app.get('/posts/:postID', function(req, res){
  const reqPostID = req.params.postID;
  Post.findOne({_id: reqPostID}).then(post=>{
    res.render("post", {postTitle: post.title, postBody: post.content});
  })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
