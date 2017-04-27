//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var express                 = require("express");
var router                  = express.Router({mergeParams: true});
var Campground              = require("../models/campground");
var Comment                 = require("../models/comment");

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
router.get("/new", function(req, res){
  res.render("campgrounds/new");
})

//--CREATE------------------------------------------------//
router.post("/", function(req, res){
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
router.delete("/",function(req, res){
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
