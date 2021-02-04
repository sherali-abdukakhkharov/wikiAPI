//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useUnifiedTopology: true, useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
  };

const Article = new mongoose.model("article", articleSchema);

///////////////////////////Requests targeting all articles///////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, articles){
    if(!err){
      res.send(articles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully add a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

///////////////////////////Requests targeting a specific article///////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated " + req.params.articleTitle + " article.");
      } else {
        res.send(err);
      }
  });
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated " + req.params.articleTitle + " article.");
      } else {
        res.send(err);
      }
  });
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err){
      res.send("Successfully deleted " + req.params.articleTitle + " article.");
    } else {
      res.send(err);
    }
  })
});




let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});