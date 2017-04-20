module.exports = function(app){
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var SpotifyStrategy = require('passport-spotify').Strategy;

    // SlideShare API Calls and Parsing
    var https = require('https');
    var parseString = require('xml2js').parseString;
    var qs = require('querystring');

    // Encrypting Password
    var bcrypt = require("bcrypt-nodejs");

    // Generating SHA1
    var crypto = require('crypto');
    var sha1 = require('sha1');
    var  request = require('request');
    passport.use(new LocalStrategy(localStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/spotify', passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'] }));

    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/checkAdmin", checkAdmin);
    app.post("/api/checkLogin", checkLogin);
    app.post("/api/logout", logout);
    app.get("/api/user", findUser);
    app.get("/api/admin/users", findAllUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.put("/api/admin/user/:userId", updateUserRole);
    app.post("/api/user", createUser);
    app.delete("/api/user/:userId", unregisterUser);
    app.delete("/api/admin/user/:userId", deleteUser);

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/project/index.html#/profile',
            failureRedirect: '/project/index.html#/login'
        }));

    app.get('/auth/spotify/callback',
        passport.authenticate('spotify', {
            successRedirect: '/project/index.html#/profile',
            failureRedirect: '/project/index.html#/login'
        }));


    var userModel = require('./../model/user/user.model.server');

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID || '226290814945-7ra1u75agakr0f830h9k170boom8f4ud.apps.googleusercontent.com',
        clientSecret : 'DrkhuYXAHyb9MBew3BVsP5yL',
        callbackURL  : '/auth/google/callback'
    };

    var spotifyConfig = {
        clientID     : 'ccc43ce0f5814af3a8c1a91f4808f720',
        clientSecret : '055d2114c2c24847ac00e2a309a3876c',
        callbackURL  : '/auth/spotify/callback'
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new SpotifyStrategy(spotifyConfig, spotifyStrategy));

    function spotifyStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserBySpotifyId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newSpotifyUser = {
                            username:  emailParts[0],
                            firstName: profile.username,
                        //    lastName:  profile.name.familyName,
                            email:     email,
                            spotify: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newSpotifyUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                        /*user.google.token = token;
                        userModel
                            .updateUser(user._id, user);

                        userModel
                            .findUserById(user._id)
                            .then(function (user) {
                                return done(null,user);
                            });*/

                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if (!user) {
                        return done(null, false);
                    } else if(user && bcrypt.compareSync(password, user.password)){
                        return done(null, user);
                    } else{
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
      //  req.session.destroy()
        req.logout();
        res.sendStatus(200);
        /*var token = req.session.passport.user.google.token;
        var url = "https://accounts.google.com/o/oauth2/revoke?token=" + token;


        var options = {
            hostname: "accounts.google.com",
            path: "/o/oauth2/revoke?token=" + token,
            method: 'POST'
        };

        https
            .request(options, function (response) {
                var body = '';
                response.on('data', function(chunk) {
                    body += chunk;
                });
                response.on('end', function() {
                    req.logout();
                    res.sendStatus(200);
                });
            }).on('error', function(err){
            res.sendStatus(500);
        });*/

     //   "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://www.example.com
        /*var url = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout";//?continue=" + req.protocol + '://' + req.get('host') + "/public/project/index.html#/login";
        console.log(url);
        request(url, function (err, result, body) {
            if(err){
                console.log(err);
                res.sendStatus(500).send("Could not fetch jobs.");
            } else{
                console.log(body);
                res.send(body);
            }
        });*/

        // var user          = req.user;
        // user.google.token = undefined;
        /*user.save(function(err) {
            console.log(user, ' has been successfully logged out.');
            res.redirect('/');
        });*/


        /* var url = "https://www.google.com/accounts/logout?continue=" + req.protocol + '://' + req.get('host') + "/public/project/index.html#/login";
         console.log(url);
             https.get(url, function (response) {
             // Continuously update stream with data
             var body = '';
             response.on('data', function(chunk) {
                 body += chunk;
             });
             response.on('end', function() {
                 console.log(body);
                 res.sendStatus(200);
             });
         }).on('error', function(err){
             res.sendStatus(500);
         });*/
    }

    function checkAdmin(req, res) {
        if(req.isAuthenticated() && req.user.role == "ADMIN"){
            res.json(req.user);
        } else{
            res.send('0');
        }
    }

    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.userId;

        var self = userId == req.user._id;
        if(self && loggedIn){
            next();
        }else{
            res.sendStatus(400).send("You are not authorized.");
        }
    }


    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;

        if(req.user && req.user.role == 'ADMIN'){
            userModel
                .deleteUser(userId)
                .then(function() {
                    res.sendStatus(200);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else{
            res.sendStatus(401);
        }
    }

    function unregisterUser(req,res) {
        var userId = req.params.userId;

        if(req.user && req.user._id == userId){
            userModel
                .deleteUser(userId)
                .then(function() {
                    res.sendStatus(200);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else{
            res.sendStatus(401);
        }


    }

    function createUser(req, res) {
        var newUser = req.body;
        newUser.password = bcrypt.hashSync(newUser.password);
        userModel
            .createUser(newUser)
            .then(function (newUser) {
                req.login(newUser, function (err) {             // login in the newUser
                    if(err){
                        res.send(400);
                    } else{
                        res.json(newUser);
                    }
                });
            }, function (err) {
                res.status(500).send(err.errors.username.message);
            });
    }

    function updateUserRole(req, res) {
        var user = req.body;
        var userId = req.params.userId;
        if(req.user && req.user.role == 'ADMIN'){
            userModel
                .updateUser(userId, user)
                .then(function (user) {
                    res.send(user);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else{
            res.sendStatus(401);
        }
    }

    function updateUser(req, res) {
        var newUser= req.body;
        var userId = req.params.userId;
        console.log("server new userid: "+ newUser._id);

        if(req.user && req.user._id == req.body._id) {
            userModel
                .updateUser(userId, newUser)
                .then(function (user) {
                    res.send(user);
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        } else{
            res.sendStatus(401);
        }

    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        //  console.log(userId);
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        
        /*
        var user = users.find(function(u){
            return u._id === userId;
        });
        
        res.json(user);*/
    }

    function findUser(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        if(username && password){
            findUserByCredentials(req, res);
        } else if(username){
            findUserByUsername(req, res);
        } else{
            res.json(req.user);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query['username'];

        userModel
            .findUserByUsername(username)
            .then(function (user) {
                if(!(user == undefined)){
                    res.json(user);
                }
                else{
                    res.sendStatus(500);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });

        /*var user = users.find(function (u) {
            return u.username == req.query['username'];
        });

        if(user){
            res.json(user);
        } else{
            res.sendStatus(404);
        }*/
    }

    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        userModel
            .findUserByCredentials(username, password)
            .then(function(user){
                if(user){
                    res.json(user);
                }
            }, function (err){
                res.sendStatus(500).send(err);
            });
        /*var user = users.find(function(user){
            return user.password == password && user.username == username;
        });

        if(user){
            res.json(user);
        } else{
            res.sendStatus(404);
        }*/
    }

    function findAllUsers(req, res) {
        if(req.user && req.user.role=='ADMIN') {
            userModel
                .findAllUsers()
                .then(function (users) {
                    res.json(users);
                });
        } else {
            res.sendStatus(401);
        }
    }
};