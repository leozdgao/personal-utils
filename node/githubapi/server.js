var http = require('http');
var qs = require('querystring');
var connect = require('connect');
var serveStatic = require('serve-static');
var request = require('request');
var config = require('./config.json');
var app = connect();

app.use(require('../extendconnect'));

// extend method
['get', 'post'].forEach(function(method) {

  app[method] || (app[method] = function(mount, cb) {

    if(typeof mount === 'function') {
      mount = handler;
    }
    
    app.use(mount, handler);

    function handler(req, res, next) {
      if(req.method.toLowerCase() === method) cb.call(null, req, res, next);
      else next();
    }
  });
});

// serve static
app.use(serveStatic('client'));

app.get('/login', function(req, res) {

  var query = {
    client_id: config.client_id,
    scope: 'user:email',
    state: new Date().toString()
  };
  var path = 'https://github.com/login/oauth/authorize?' + qs.stringify(query);
  res.redirect(path);
});

app.get('/callback', function(req, res) {
  
  var query = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: req.query.code
  };
  var path = 'https://github.com/login/oauth/access_token?' + qs.stringify(query);
  request.post(path, function(err, r, body) {
    if(err) res.json(err);
    else {
      var result = qs.parse(body);  
      var access_token = result.access_token;
      var scope = result.scope;

      request({
        uri: 'https://api.github.com/user?access_token=' + access_token,
        method: 'GET',
        headers: {
          'user-agent': req.headers['user-agent']
        }
      }, function(err, r, body) {
        if(err) res.json(err);
        else {
          // redirect maybe
          res.json(JSON.parse(body));
        }
      });
    }
  });
});

app.use(function(req, res, next) {
  next(new Error('404 NOT FOUND'));
});

// handle errors
app.use(function(err, req, res, next) {
  console.log('error: %s', err.message);
  res.end();
});

http.createServer(app).listen(3000, function () {
  console.log('Server listening...');
});
