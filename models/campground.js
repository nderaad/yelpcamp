var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var campSchema = new Schema({
  name : String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Campground = mongoose.model('Campground', campSchema);

module.exports = Campground;
