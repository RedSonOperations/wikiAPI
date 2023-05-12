const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose = require('mongoose');
const { exec } = require("child_process");
const { error } = require('console');
const lodash=require('lodash');

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser: true});

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article=new mongoose.model("Article", articleSchema);


app.route("/articles")

.get(function(req, res){
    Article.find().then(function(articles){
        res.send(articles);
    }).catch(function(error){
        res.send(err);
    })
})

.post(function(req, res){
    const title=req.body.title;
    const content=req.body.content;
    const newArticle= new Article({
        title: title,
        content: content
    })
    newArticle.save().then(function(newArticle){
        if(newArticle){
            console.log("Successfully added new article, '" + newArticle.title + "'!");
            res.send("Successfully added new article, '" + newArticle.title + "'!");
        }
    }).catch(function(err){
        if(err){
            res.send(err);
        }
    })
})

.delete(function(req, res){
    // all articles get deleted
    Article.deleteMany({}).then(function(err){
        if(!err){
            res.send("Deleted all articles!");
        }else{
            res.send(err);
        }
    })
});


app.route("/articles/:articleTitle")

.get(function(req, res){
    const articleTitle=req.params.articleTitle;

    Article.findOne({title: articleTitle}).then(function(article){
        if(article){
            res.send("Found article, '"+articleTitle+"'!");
        }else{
            res.send("No article with title, '"+articleTitle+"' found.");
        }
        
    }).catch(function(err){
        if(err){
            res.send(err);
        }
    })
})

.put(function(req, res){
    const title=req.body.title;
    const content=req.body.content;
    const articleTitle=req.params.articleTitle;
    Article.findOneAndUpdate({title: articleTitle}, {title: title, content: content}, {overwrite: true}).then(function(updatedArticle){
        if(updatedArticle){
            res.send("Updated to new "+title+"!");
        }
    }).catch(function(err){
        if(err){
            res.send(err);
        }
    })
})

.patch(function(req, res){
    const articleTitle=req.params.articleTitle;
    const title=req.body.title;
    const content=req.body.content;
    Article.findOneAndUpdate({title: articleTitle}, {$set: req.body}).then(function(updatedArticle){
        if(updatedArticle){
            res.send("Updated article!");
        }
    }).catch(function(err){
        if(err){
            res.send(err);
        }
    })
})

.delete(function(req, res){
    const articleTitle=req.params.articleTitle;
    Article.deleteOne({title: articleTitle}).then(function(deletedArticle){
        if(deletedArticle){
            res.send("Deleted article, '" + articleTitle + "'!");
        }else{
            res.send("Failed to delete article, '"+articleTitle+"' because it does not exist.");
        }
    }).catch(function(err){
        if(err){
            res.send(err);
        }
    })
});



app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000.");
    exec("start microsoft-edge:http://localhost:3000");
  });