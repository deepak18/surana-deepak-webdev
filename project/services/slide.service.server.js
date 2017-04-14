/**
 * Created by Deepak on 4/6/2017.
 */

module.exports = function(app){

    var passport = require('passport');
    // SlideShare API Calls and Parsing
    var https = require('https');
    var parseString = require('xml2js').parseString;
    var qs = require('querystring');

    // Generating SHA1
    var sha1 = require('sha1');

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get("/api/slides/:topic", getSlidesByTopic);
    app.get("/api/slides/details/:slideID", findSlideByID);
    app.get("/api/slides/favorites/:slideID", checkSlideinFavorites);
    app.post("/api/slides/favorites/:slideID", addSlidetoFavorites);
    app.delete("/api/slides/favorites/:slideID", removeSlidefromFavorites);

    var userModel = require('./../model/user/user.model.server');

    function removeSlidefromFavorites(req, res) {
        var slideID = req.params.slideID;
        var userID = req.session.passport.user._id;

        //console.log(userID);

        userModel
            .removeSlidefromFavorites(slideID, userID)
            .then(function (user) {
                if(!(user == undefined)){
                    console.log(user);
                    res.json(user);
                }
                else{
                    res.sendStatus(500);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function addSlidetoFavorites(req, res) {
        var slideID = req.params.slideID;
        var userID = req.session.passport.user._id;

        //console.log(userID);

        userModel
            .addSlidetoFavorites(slideID, userID)
            .then(function (user) {
                if(!(user == undefined)){
                    console.log(user);
                    res.json(user);
                }
                else{
                    res.sendStatus(500);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function checkSlideinFavorites(req, res) {
        var slideID = req.params.slideID;
        var userID = req.session.passport.user._id;

        //console.log(userID);

        userModel
            .checkSlideinFavorites(slideID, userID)
            .then(function (user) {
                if(!(user == undefined)){
                    console.log(user);
                    res.json(user);
                }
                else{
                    res.sendStatus(500);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findSlideByID(req, res) {
        var ID = req.params.slideID;
        var ts = new Date().getTime()/1000|0;
        var sharedSecret = 'eT1s3Ngo';
        var hash = sha1(sharedSecret+ts);
        var urlpath = "/api/2/get_slideshow?api_key=SfB4dMhb&ts="+ts+"&hash="+hash+"&slideshow_id="+ID+"&detailed=1";

        var url = "https://www.slideshare.net/api/2/get_slideshow?api_key=SfB4dMhb&ts="+ts+"&hash="+hash+"&slideshow_id="+ID+"&detailed=1";

        //console.log(url);
        var options = {
            hostname: "www.slideshare.net",
            path: urlpath
        };

        https.get(options, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                parseString(body, function (err, result) {
                    if(err) {
                        res.sendStatus(500);
                    } else {
                        res.json(JSON.stringify(result));
                    }
                });
            });
        }).on('error', function(err){
            res.sendStatus(500);
        });

        //    res.send({output: 'return from server'});
    }

    function getSlidesByTopic(req, res) {
        var topic = req.params.topic;
        var ts = new Date().getTime()/1000|0;
        var sharedSecret = 'eT1s3Ngo';
        var hash = sha1(sharedSecret+ts);

        var q = qs.escape(topic);
        var urlpath = "/api/2/search_slideshows?api_key=SfB4dMhb&ts="+ts+"&hash="+hash+"&q="+q+"&detailed=1";

        var url = "https://www.slideshare.net/api/2/search_slideshows?api_key=SfB4dMhb&ts="+ts+"&hash="+hash+"&q="+q+"&detailed=1";

        //console.log(url);
        var options = {
            hostname: "www.slideshare.net",
            path: urlpath
        };

        https.get(options, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                parseString(body, function (err, result) {
                    if(err) {
                        res.sendStatus(500);
                    } else {
                        res.json(JSON.stringify(result));
                    }
                });
            });
        }).on('error', function(err){
            res.sendStatus(500);
        });

        //    res.send({output: 'return from server'});
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
};