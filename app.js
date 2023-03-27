//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const posts = [];
const appID = "VVNdfqTZCwEWhLK3ndRLr0lYlUAC06lzsnXiS41Xaqs";

//Home Page
app.get("/", async function(req,res){
  const quote = await getQuote();
  
  res.render("home", {startingContent: homeStartingContent, newPosts: posts, Quote:quote[0], author:quote[1]});

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
  const post = {
    postTitle: req.body.newContentTitle,
    postBody: req.body.newContent,
    postImg: img
  };
  posts.push(post);
  console.log(posts);
  res.redirect('/');
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
app.get('/posts/:topic', function(req, res){
  const reqTitle =_.kebabCase(req.params.topic);

  posts.forEach(function(post){
    const storedTitle = _.kebabCase(post.postTitle);
    if(storedTitle === reqTitle){
      res.render("post", {postTitle: post.postTitle, postBody: post.postBody});
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
