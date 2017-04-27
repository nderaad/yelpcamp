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

//--INDEX------------------------------------------------//
router.get("/", function(req,res){
  res.render("landing");
});

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
