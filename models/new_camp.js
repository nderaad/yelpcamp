var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var campSchema = new Schema({
  name : String,
  image: String,
  description: String,
});

var CampMod = mongoose.model('newCamp', campSchema);

module.exports = CampMod;
