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
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(foundComment.author.id.equals(req.user._id)){
        next();
      } else {
        res.redirect("back");
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
        res.redirect("back");
      } else {
        //does user own campground?
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

module.exports = middlewareObj
