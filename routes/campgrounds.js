//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var express                 = require("express");
var router                  = express.Router({mergeParams: true});
var Campground              = require("../models/campground");
var Comment                 = require("../models/comment");

//-------------------------------------------------------//
// MIDDLEWARE
//-------------------------------------------------------//

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
};

//--INDEX------------------------------------------------//
router.get("/", function(req, res){
  Campground.find({}, function(err,campground) {
        if(err) {
          console.log(err);
        } else {
        res.render("campgrounds", {campgrounds: campground});
        }
      });
});

//--NEW------------------------------------------------//
router.get("/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new");
})

//--CREATE------------------------------------------------//
router.post("/", isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name: name, image: image, description: desc, author: author};
  Campground.create(newCampground, (function(err, camp){
    if(err){
      throw(err)
    } else {console.log(camp);}
  }));
  res.redirect("/campgrounds");
});

//--DELETE------------------------------------------------//
router.delete("/", isLoggedIn, function(req, res){
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
  res.redirect("/");
});

//--SHOW------------------------------------------------//
router.get("/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
      throw(err);
    } else {
      // console.log(foundCampground.name);
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });
});

module.exports = router;
