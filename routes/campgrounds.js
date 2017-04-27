//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var express                 = require("express");
var router                  = express.Router({mergeParams: true});
var Campground              = require("../models/campground");
var Comment                 = require("../models/comment");

//--USE------------------------------------------------//
//this is middleware that will run on all routes below providing access to the information about the User (if any) to the route and then running next()
router.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
})

//-------------------------------------------------------//
// MIDDLEWARE
//-------------------------------------------------------//

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        res.redirect("back");
      } else {
        //does user own campground?
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect(back);
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

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

//--EDIT--------------------------------------------------//
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log("there's an error");
    } else {
    res.render("campgrounds/edit", {campground: campground});
    }
  });
});

//--UPDATE------------------------------------------------//
router.put("/:id", checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.editedCampground, function(err, camp){
    console.log(camp);
    if(err){
      console.log(err);
    } else {
          res.redirect("/campgrounds/" + camp.id);
    }
  });
});

//--DELETE------------------------------------------------//
router.delete("/:id", checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      res.send("YOU EFFED UP");
    } else {
      res.redirect("/campgrounds");
    }
  });
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
