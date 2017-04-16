var configValues = require('./config');

module.exports = {
  getDbConnectionString: function() {
    return 'mongodb://' + configValues.uname + ':'
    + configValues.pwd + '@ds161890.mlab.com:61890/demy';
  }
}
