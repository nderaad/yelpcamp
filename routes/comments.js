//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var express                 = require("express");
var router                  = express.Router({mergeParams: true}); //mergeparams will allow us to access id in the route since it is stuck in app.js
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

//-EDIT--------------------------------------------------//
router.get("/:comment_id/edit", function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
    }
  });
});

//-UPDATE------------------------------------------------//
router.put("/:comment_id", function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//-DESTROY-----------------------------------------------//
router.delete("/:comment_id", function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
