var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//--using bluebird promises installed instead of native ES6 for 4X speed
mongoose.Promise = require('bluebird');
//--establishing connection with config Folder that
//--has credentials and location of MongoD
var config = require('./config');


app.use(bodyParser.urlencoded({extended: true}));//allows app to parse body of http requests (e.g. GET, POST, etc.)
app.use(express.static('public')); //tells express to serve up public folder for accessing static files
app.set('view engine', 'ejs');//sets template engine to ejs enabling ejs

//--establish connection with MondgoDB using config requirement above
mongoose.connect(config.getDbConnectionString());

var cgrounds = [
  {name: 'Salmon Creek', image: 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'},
  {name:'Granite Hill', image: 'https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg'},
  {name: 'Mountain Goats Rest', image: 'http://www.photosforclass.com/download/7360193870'},
  {name: 'Salmon Creek', image: 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'},
  {name:'Granite Hill', image: 'https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg'},
  {name: 'Mountain Goats Rest', image: 'http://www.photosforclass.com/download/7360193870'},
  {name: 'Salmon Creek', image: 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg'},
  {name:'Granite Hill', image: 'https://farm9.staticflickr.com/8311/7930038740_d86bd62a7e.jpg'},
  {name: 'Mountain Goats Rest', image: 'http://www.photosforclass.com/download/7360193870'}
];

app.get('/', function(req,res){
  res.render('landing');
});

app.get('/campgrounds', function(req,res){
  res.render('campgrounds', {campgrounds: cgrounds});
});

app.post('/campgrounds', function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  cgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req,res){
  res.render('new');
})

app.get('*',function(req,res){
  res.send("Opps this page does not exist?");
})

app.listen(3000, function(){
  console.log("YelpCamp server is listening on Port 3000")
});
