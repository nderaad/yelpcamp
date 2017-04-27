//-------------------------------------------------------//
// DEPENDENCIES
//-------------------------------------------------------//

var express                 = require("express");
var router                  = express.Router({mergeParams: true});
var passport                = require("passport");
var LocalStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");
var expressSession          = require("express-session");
var User                    = require("../models/user")
var Campground              = require("../models/campground");

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
router.get("/", function(req,res){
  res.render("landing");
});

//-------------------------------------------------------//
// AUTHENTICATION ROUTES
//-------------------------------------------------------//

//--SHOW REGISTER----------------------------------------//
router.get("/register", function(req,res){
  res.render("register");
});

//--NEW REGISTER----------------------------------------//
router.post("/register", function(req,res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

//--SHOW LOGIN-------------------------------------------//
router.get("/login", function(req,res){
  res.render("login");
});

//--LOGIN-------------------------------------------//
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){
});

//--LOGOUT-------------------------------------------//
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/login");
});




module.exports = router;
