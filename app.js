//-------------------------------------------------------//
// DEPENDENCIES SECTION
//-------------------------------------------------------//

var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
mongoose.Promise   = require("bluebird");//--using bluebird promises installed instead of native ES6 for 4X speed
var config         = require("./config");//--establishing connection with config Folder that has credentials and location of MongoDB
var Campground     = require("./models/campground");
var Comment       = require("./models/comment");
var seedDB         = require("./seeds");

// seedDB();
//-------------------------------------------------------//
// USE SECTION
//-------------------------------------------------------//

app.use(bodyParser.urlencoded({extended: true}));//allows app to parse body of http requests (e.g. GET, POST, etc.)
app.use(express.static(__dirname + "/public")); //tells express to serve up public folder for accessing static files
app.set("view engine", "ejs");//sets template engine to ejs enabling ejs

//-------------------------------------------------------//
// MONGODB SECTION
//-------------------------------------------------------//

//--establish connection with MondgoDB using config requirement above
mongoose.connect(config.getDbConnectionString());

//-------------------------------------------------------//
// ROUTES SECTION
//-------------------------------------------------------//

//--INDEX------------------------------------------------//
app.get("/", function(req,res){
  res.render("landing");
});

//--INDEX------------------------------------------------//
app.get("/campgrounds", function(req,res){
  Campground.find(function(err,campgrounds) {
        if(err) throw err;
        res.render("campgrounds", {campgrounds: campgrounds});
      });
});

//--NEW------------------------------------------------//
app.get("/campgrounds/new", function(req,res){
  res.render("campgrounds/new");
})

//--CREATE------------------------------------------------//
app.post("/campgrounds", function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  Campground.create(newCampground, (function(err, camp){
    if(err){
      throw(err)
    } else {console.log("We saved the new camp");}
  }));
  res.redirect("/campgrounds");
});

//--DELETE------------------------------------------------//
app.delete("/campgrounds",function(req,res){
  var id = req.body.id;
  var deleteCamp = Campground({id:id});
  deleteCamp.delete(function(err,camp){
    if(err){
      throw(err)
    } else {
      console.log("Camp Deleted");
      console.log(camp);
    }
  });
  res.redirect("/campgrounds");
});

//--SHOW------------------------------------------------//
app.get("/campgrounds/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
      throw(err);
    } else {
      // console.log(foundCampground.name);
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

//-------------------------------------------------------//
// COMMENT ROUTES SECTION
//-------------------------------------------------------//

//--NEW------------------------------------------------//
app.get("/campgrounds/:id/comments/new", function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      throw(err)
    } else {
      res.render("comments/new",{campground:campground});
    }
  });
});

//--CREATE------------------------------------------------//
app.post("/campgrounds/:id/comments", function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    Comment.create(req.body.comment,function(err,comment){
      if(err){
        throw(err);
        res.redirect("/campgrounds");
      } else {
        campground.comments.push(comment);
        campground.save();
        res.redirect("/campgrounds/" + campground._id);
      }
    });
  });
});

//--CATCH------------------------------------------------//
app.get("*",function(req,res){
  res.send("Opps this page does not exist");
});

//-------------------------------------------------------//
// PORT SECTION
//-------------------------------------------------------//

app.listen(3000, function(){
  console.log("YelpCamp server is listening on Port 3000")
});
