var mongoose      = require("mongoose");
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");

var data = [
  {
    name: "Cloud's Rest",
    image: "http://i.imgur.com/8EHGA.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec leo lacus. Vivamus blandit, odio sit amet consectetur eleifend, nibh nisi feugiat diam, suscipit placerat purus velit quis quam. Nam ut nibh et nisl viverra auctor. Morbi elementum ipsum eu nulla viverra ultricies. Suspendisse fermentum lectus ut placerat commodo. Duis sem mauris, varius non laoreet sit amet, maximus eget felis. Fusce ex nulla, molestie in enim quis, bibendum sagittis diam. Nulla eu mattis mi. Curabitur nulla arcu, interdum nec pulvinar in, ultricies ac dolor. Suspendisse laoreet purus in ornare elementum."
  },
  {
    name: "Duke's Point",
    image: "http://a57.foxnews.com/images.foxnews.com/content/fox-news/travel/2014/06/26/best-places-to-camp-in-us/_jcr_content/list-par/list_item/image.img.jpg/876/493/1422729935544.jpg?ve=1&tl=1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec leo lacus. Vivamus blandit, odio sit amet consectetur eleifend, nibh nisi feugiat diam, suscipit placerat purus velit quis quam. Nam ut nibh et nisl viverra auctor. Morbi elementum ipsum eu nulla viverra ultricies. Suspendisse fermentum lectus ut placerat commodo. Duis sem mauris, varius non laoreet sit amet, maximus eget felis. Fusce ex nulla, molestie in enim quis, bibendum sagittis diam. Nulla eu mattis mi. Curabitur nulla arcu, interdum nec pulvinar in, ultricies ac dolor. Suspendisse laoreet purus in ornare elementum."
  },
  {
    name: "Fog Ridge",
    image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1428516326/campground-photos/htyb1p0ygmvqfpuguplb.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec leo lacus. Vivamus blandit, odio sit amet consectetur eleifend, nibh nisi feugiat diam, suscipit placerat purus velit quis quam. Nam ut nibh et nisl viverra auctor. Morbi elementum ipsum eu nulla viverra ultricies. Suspendisse fermentum lectus ut placerat commodo. Duis sem mauris, varius non laoreet sit amet, maximus eget felis. Fusce ex nulla, molestie in enim quis, bibendum sagittis diam. Nulla eu mattis mi. Curabitur nulla arcu, interdum nec pulvinar in, ultricies ac dolor. Suspendisse laoreet purus in ornare elementum."
  },
];

function seedDB(){
  Campground.remove({},function(err){
    if(err){
      throw(err);
    } else {
    console.log("removed campgrounds");
    // add campgrounds
    data.forEach(function(seed){
      Campground.create(seed, function(err,camp){
        if(err){
          throw(err);
        } else {
          console.log(camp);
          Comment.create(
            {
              text:"This place is great but I wish there was internet",
              author:"Homer"
            }, function(err,comment){
          if(err){
            throw(err);
          } else {
            camp.comments.push(comment);
            camp.save();
            console.log("campground comment was created");
          }
        });
        }
      });
    });
  };
  });
};

module.exports = seedDB;
