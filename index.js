const express = require('express'),
  https = require('https'),
  fs = require('fs'),
  session = require('express-session'),
  app = express();

//Express Setup
app.set('view engine', 'pug');
app.use(session({
  secret: '42',
  resave: false,
  saveUninitialized: true
}))
app.get('/', function (req, res) {
  res.render('index');
});

app.post('/mirrormirror', function(req, res){
  var payload;
  req.on('data', function(data){
    //Could have some logic here to determine if the payload is too big or not
    payload+=data;
  });
  req.on('end', function(){
    var key = Math.random();
    req.session[key] = payload;
    res.send({result:key});
    setTimeout(function(){
      if(req.session[key]) {
        delete req.session[key];
      }
    },40000);
  });
});

app.get('/mirrormirror', function(req,res){
  var key = req.query && req.query.key;
  if(req.session[key]) {
    res.set('Cache-Control', 'max-age=9001');//Over 9000
    let body = req.session[key];
    delete req.session[key];
    res.send(body);
  }
  else {
    res.status('404').send();
  }
});

app.listen(1337, function () {
  console.log('Example app listening on port 1337!');
});