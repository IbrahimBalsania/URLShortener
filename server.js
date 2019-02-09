'use strict';

var express = require('express');
//var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortUrl = require('./models/shortURL');
var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/shortUrls');
app.use(bodyParser.json());
app.use(cors());
var originalUrl = "";
var shorterUrl = "";
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.static(__dirname+'/public'));
app.get('/new/:urlToShorten(*)',(req ,res,next)=>{
  var {urlToShorten} = req.params;
  var short = Math.floor(Math.random()*100000).toString();
  var data = new shortUrl({
    originalUrl:urlToShorten,
    shorterUrl:short
  });
  data.save(err=>{
    if(err){
      res.send('Error saving to DB');
    }
  });
  
  return res.json({data});
});
app.get('/:urlToForward',(req,res,next)=>{
  var shorterUrl = req.params.urlToForward;
  shortUrl.findOne({'shortenUrl':shorterUrl},(err,data)=>{
    if(err) return res.send('Error finding in DB.');
    res.redirect(301,'http://'+data.originalUrl);
  });
});


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});