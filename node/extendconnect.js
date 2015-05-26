var http = require('http');
var qs = require('querystring');

module.exports = function(req, res, next) {
  /**
   * Extend for IncomingMessage
   */
  var temp = req.url.split('?');
  req.path = temp[0];
  req.query = qs.parse(temp[1]);


  /**
   * Extend for ServerResponse;
   */
  res.json = function(obj) {

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj, null, 4)); // let the exception throw
  };
  res.redirect = function(path) {

    res.statusCode = 302;
    res.setHeader('Location', path);
    
    res.end();
  };


  next();
}


var response = http.ServerResponse;