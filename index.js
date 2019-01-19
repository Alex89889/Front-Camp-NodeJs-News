const express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");
const app = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));
  
app.get('/', function(request, response) {
  response.contentType('application/json');
  var content = fs.readFileSync("article.json", "utf8");
  var articleJSON = JSON.parse(content);
  response.send(articleJSON);
});
//API
app.get("/api/article", function(req, res){
    var content = fs.readFileSync("article.json", "utf8");
    var article = JSON.parse(content);
    res.send(article);
});

app.get("/api/article/:id", function(req, res){
      
    var id = req.params.id; // получаем id
    var content = fs.readFileSync("article.json", "utf8");
    var articles = JSON.parse(content);
    var article = null;
    // находим в массиве пользователя по id
    for(var i=0; i<articles.length; i++){
        if(articles[i].id==id){
            article = articles[i];
            break;
        }
    }
    // отправляем пользователя
    if(article){
        res.send(article);
    }
    else{
        res.status(404).send();
    }
});

// получение отправленных данных
app.post("/api/articles", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
    var articleName = req.body.name;
    var articleAuthor = req.body.auhtor;
    var article = {name: articleName, auhtor: articleAuthor};
     
    var data = fs.readFileSync("article.json", "utf8");
    var articles = JSON.parse(data);
     
    // находим максимальный id
    var id = Math.max.apply(Math,articles.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    article.id = id+1;
    // добавляем пользователя в массив
    articles.push(article);
    var data = JSON.stringify(articles);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("article.json", data);
    res.send(article);
});

 // удаление пользователя по id
app.delete("/api/articles/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("article.json", "utf8");
    var articles = JSON.parse(data);
    var index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i<articles.length; i++){
        if(articles[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        var article = articles.splice(index, 1)[0];
        var data = JSON.stringify(articles);
        fs.writeFileSync("article.json", data);
        // отправляем удаленного пользователя
        res.send(article);
    }
    else{
        res.status(404).send();
    }
});

// изменение пользователя
app.put("/api/articles", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var articleId = req.body.id;
    var articleName = req.body.name;
    var articleAuhtor = req.body.auhtor;
     
    var data = fs.readFileSync("article.json", "utf8");
    var articles = JSON.parse(data);
    var article;
    for(var i=0; i<articles.length; i++){
        if(articles[i].id==articleId){
            article = articles[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(article){
        article.auhtor = articleAuhtor;
        article.name = articleName;
        var data = JSON.stringify(articles);
        fs.writeFileSync("article.json", data);
        res.send(article);
    }
    else{
        res.status(404).send(article);
    }
});

// Error handling middle-ware

app.use(function(err,req,res,next) {
  console.log(err.stack);
  res.status(500).send({"Error" : err.stack});
});

app.listen(8080, () => {
  console.log('News app listening on port 8080!')
});