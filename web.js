var async   = require('async');
var express = require('express');
var util    = require('util');

// create an express webserver
var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' }),
  require('faceplate').middleware({
    app_id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_SECRET,
    scope:  'user_likes,user_photos,user_photo_video_tags'
  })
);

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.dynamicHelpers({
  'host': function(req, res) {
    return req.headers['host'];
  },
  'scheme': function(req, res) {
    req.headers['x-forwarded-proto'] || 'http'
  },
  'url': function(req, res) {
    return function(path) {
      return app.dynamicViewHelpers.scheme(req, res) + app.dynamicViewHelpers.url_no_scheme(path);
    }
  },
  'url_no_scheme': function(req, res) {
    return function(path) {
      return '://' + app.dynamicViewHelpers.host(req, res) + path;
    }
  }
});

// render
function render_page(req, res, tmpl) {
    
    tmpl = tmpl || 'frenemy.ejs';
    
            res.render(tmpl, {
                layout:    false,
                req:       req,
                app:       app,
//                user:      user
            });
    
//    console.log('req.facebook.app coming next')
//    console.log(req.facebook)
//    
//    req.facebook.app(function(app) {
//        
//        console.log('app coming next')
//        console.log(app)
//        
//        if(app.error !== 'undefined') {
//            console.log('oops weve found an error')
//            console.log(app.error)
//            return;
//        }
//        
//        req.facebook.me(function(user) {
//            
//            console.log('user and app coming next')
//            console.log(app)
//            console.log(user)
//            
//            res.render(tmpl, {
//                layout:    false,
//                req:       req,
//                app:       app,
//                user:      user
//            });
//        });
//    });

}

// handle requests
function handle_translator_request(req, res) {
    render_page(req, res, 'translator.ejs');
}

function handle_facebook_request(req, res) {
    
  // if the user is logged in
  if (req.facebook.token) {

    async.parallel([
      function(cb) {
        // query 4 friends and send them to the socket for this socket id
        req.facebook.get('/me/friends', { limit: 4 }, function(friends) {
          req.friends = friends;
          cb();
        });
      },
      function(cb) {
        // query 16 photos and send them to the socket for this socket id
        req.facebook.get('/me/photos', { limit: 16 }, function(photos) {
          req.photos = photos;
          cb();
        });
      },
      function(cb) {
        // query 4 likes and send them to the socket for this socket id
        req.facebook.get('/me/likes', { limit: 4 }, function(likes) {
          req.likes = likes;
          cb();
        });
      },
      function(cb) {
        // use fql to get a list of my friends that are using this app
        req.facebook.fql('SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1', function(result) {
          req.friends_using_app = result;
          cb();
        });
      }
    ], function() { // callback
      render_page(req, res);
    });

  } else {
    render_page(req, res);
  }
  
}

// hooks
app.get('/', handle_facebook_request);
app.get('/translator', handle_translator_request);
app.post('/', handle_facebook_request);
