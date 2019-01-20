const express = require('express');

var fs = require("fs");
const app = express();

  
app.get('/', function(request, response) {
  response.contentType('application/json');
  var content = fs.readFileSync("article.json", "utf8");
  var articleJSON = JSON.parse(content);
  response.send(articleJSON);
});

// Error handling middle-ware

app.use(function(err,req,res,next) {
  console.log(err.stack);
  res.status(500).send({"Error" : err.stack});
});

app.listen(8080, () => {
  console.log('News app listening on port 8080!')
});