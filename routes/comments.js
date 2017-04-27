//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var express                 = require("express");
var router                  = express.Router({mergeParams: true}); //mergeparams will allow us to access id in the route since it is stuck in app.js
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

//-------------------------------------------------------//
// COMMENT ROUTES
//-------------------------------------------------------//

//--NEW--------------------------------------------------//
router.get("/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      throw(err)
    } else {
      res.render("comments/new",{campground:campground});
    }
  });
});

//--CREATE------------------------------------------------//
router.post("/", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    Comment.create(req.body.comment,function(err,comment){
      if(err){
        throw(err);
        res.redirect("/campgrounds");
      } else {
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        console.log(comment);
        campground.comments.push(comment);
        campground.save();
        res.redirect("/campgrounds/" + campground._id);
      }
    });
  });
});

module.exports = router;
