var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
//--using bluebird promises installed instead of native ES6 for 4X speed
mongoose.Promise   = require('bluebird');
//--establishing connection with config Folder that
//--has credentials and location of MongoD
var config         = require('./config');
var CampMod        = require('./models/new_camp');


//-------------------------------------------------------//
// USE SECTION
//-------------------------------------------------------//

app.use(bodyParser.urlencoded({extended: true}));//allows app to parse body of http requests (e.g. GET, POST, etc.)
app.use(express.static('public')); //tells express to serve up public folder for accessing static files
app.set('view engine', 'ejs');//sets template engine to ejs enabling ejs

//--establish connection with MondgoDB using config requirement above
mongoose.connect(config.getDbConnectionString());


//-------------------------------------------------------//
// ROUTES SECTION
//-------------------------------------------------------//

//--INDEX------------------------------------------------//
app.get('/', function(req,res){
  res.render('landing');
});

//--INDEX------------------------------------------------//
app.get('/campgrounds', function(req,res){
  CampMod.find(function(err,campgrounds) {
        if(err) throw err;
        res.render('campgrounds', {campgrounds: campgrounds});
      });
});

//--NEW------------------------------------------------//
app.get('/campgrounds/new', function(req,res){
  res.render('new');
})

//--CREATE------------------------------------------------//
app.post('/campgrounds', function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  CampMod.create(newCampground, (function(err, camp){
    if(err){
      throw(err)
    } else {console.log("We saved the new camp");}
  }));
  res.redirect('/campgrounds');
});

//--DELETE------------------------------------------------//
app.delete('/campgrounds',function(req,res){
  var id = req.body.id;
  var deleteCamp = CampMod({id:id});
  deleteCamp.delete(function(err,camp){
    if(err){
      throw(err)
    } else {
      console.log("Camp Deleted");
      console.log(camp);
    }
  });
  res.redirect('/campgrounds');
});

//--SHOW------------------------------------------------//
app.get('/campgrounds/:id',function(req,res){
  CampMod.findById(req.params.id, function(err,foundCampground){
    if(err){
      throw(err)
    } else {
      // console.log(foundCampground.name);
      res.render('show',{campground: foundCampground})
    }
  });
});

//--CATCH------------------------------------------------//
app.get('*',function(req,res){
  res.send("Opps this page does not exist?");
})

//-------------------------------------------------------//
// PORT SECTION
//-------------------------------------------------------//

app.listen(3000, function(){
  console.log("YelpCamp server is listening on Port 3000")
});
