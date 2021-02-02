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


app.get("/articles", function(req, res){
    Article.find(function(err, articles){
      if(!err){
        res.send(articles);
      } else {
        res.send(err);
      }
      

    });
});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});