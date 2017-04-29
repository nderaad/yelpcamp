//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var express                 = require("express");
var router                  = express.Router({mergeParams: true}); //mergeparams will allow us to access id in the route since it is stuck in app.js
var Campground              = require("../models/campground");
var Comment                 = require("../models/comment");
var middleware              = require("../middleware");

//--USE------------------------------------------------//
//this is middleware that will run on all routes below providing access to the information about the User (if any) to the route and then running next()
router.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//-------------------------------------------------------//
// ROUTES
//-------------------------------------------------------//

//--NEW--------------------------------------------------//
router.get("/new", middleware.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      req.flash("error", "Hmm, something went wrong. Try refreshing the page");
      res.redirect("back");
      throw(err);
      res
    } else {
      res.render("comments/new",{campground:campground});
    }
  });
});

//--CREATE------------------------------------------------//
router.post("/", middleware.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    Comment.create(req.body.comment,function(err,comment){
      if(err){
        req.flash("error", "Hmm, something went wrong. Try refreshing the page");
        console.log(err);
        res.redirect("back");
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
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      req.flash("error", "It looks like we can't find that comment right now");
      res.redirect("back");
    } else {
      res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
    }
  });
});

//-UPDATE------------------------------------------------//
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      console.log(err);
      req.flash("error", "Hmm, something went wrong. Try refreshing the page");
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//-DESTROY-----------------------------------------------//
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      req.flash("error", "Hmm, something went wrong. Try refreshing the page");
      res.redirect("back");
    } else {
      req.flash("success", "Comment Deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
