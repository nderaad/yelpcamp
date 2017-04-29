//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var Campground              = require("../models/campground");
var Comment                 = require("../models/comment");

//-------------------------------------------------------//
// MIDDLEWARE
//-------------------------------------------------------//

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error", "Please <a href=\'../register\'>Sign Up</a> or <a href=\'../login\'>Login</a> to do that");
    res.redirect("back");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        req.flash("error", "Comment not found")
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "Sorry, you can only edit or delete your own comments");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campgound not found");
        res.redirect("back");
      } else {
        //does user own campground?
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "Sorry, you can only edit or delete campgrounds that you created");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please <a href=\'register\'>Sign Up</a> or <a href=\'login\'>Login</a> to do that");
    res.redirect("back");
  }
};

module.exports = middlewareObj
