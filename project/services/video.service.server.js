/**
 * Created by Deepak on 4/6/2017.
 */

module.exports = function(app){

    var passport = require('passport');
    // SlideShare API Calls and Parsing
    var https = require('https');
    var qs = require('querystring');

    // Generating SHA1
    var sha1 = require('sha1');

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.get("/api/videos/:topic", getVideosByTopic);
    app.get("/api/videos/related/:videoID", findRelatedVideosByID);
    app.get("/api/videos/details/:videoID", findVideoById);
    app.get("/api/videos/favorites/:videoID", checkVideoinFavorites);
    app.post("/api/videos/favorites/:videoID", addVideotoFavorites);
    app.delete("/api/videos/favorites/:videoID", removeVideofromFavorites);

    var userModel = require('./../model/user/user.model.server');

    function removeVideofromFavorites(req, res) {
        var videoID = req.params.videoID;
        var userID = req.session.passport.user._id;

        //console.log(userID);

        userModel
            .removeVideofromFavorites(videoID, userID)
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

    function addVideotoFavorites(req, res) {
        var videoID = req.params.videoID;
        var userID = req.session.passport.user._id;

        console.log(userID);

        userModel
            .addVideotoFavorites(videoID, userID)
            .then(function (user) {
                if(!(user == undefined)){
                    // console.log(user);
                    res.json(user);
                }
                else{
                    res.sendStatus(500);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function checkVideoinFavorites(req, res) {
        var videoID = req.params.videoID;
        var userID = req.session.passport.user._id;

        //console.log(userID);

        userModel
            .checkVideoinFavorites(videoID, userID)
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

    function findRelatedVideosByID(req, res) {
        var ID = req.params.videoID;
        var API_KEY = "AIzaSyD0_FrI0nPWEedHXmYXo2YY_31oWBTEG3o";

        var urlpath = "/youtube/v3/search?part=snippet&relatedToVideoId="+ID+"&type=video+&key="+API_KEY+"&fields=items";

        var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId="+ID+"&type=video+&key="+API_KEY+"&fields=items";

        //console.log(url);
        var options = {
            hostname: "www.googleapis.com",
            path: urlpath
        };

        https.get(options, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                res.json(parsed);
            });
        }).on('error', function(err){
            res.sendStatus(500);
        });
    }
    function findVideoById(req, res) {
        var ID = req.params.videoID;
        var API_KEY = "AIzaSyD0_FrI0nPWEedHXmYXo2YY_31oWBTEG3o";

        var urlpath = "/youtube/v3/videos?part=snippet&id="+ID+"&key="+API_KEY+"&fields=items&type=video";

        var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+ID+"&key="+API_KEY+"&fields=items&type=video";

        //console.log(url);
        var options = {
            hostname: "www.googleapis.com",
            path: urlpath
        };

        https.get(options, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                res.json(parsed);
            });
        }).on('error', function(err){
            res.sendStatus(500);
        });
    }

    function getVideosByTopic(req, res) {
        var topic = req.params.topic;
        var q = qs.escape(topic);
        var API_KEY = "AIzaSyD0_FrI0nPWEedHXmYXo2YY_31oWBTEG3o";
        var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+q+"&key="+API_KEY+"&maxResults=10&type=video";
        var urlpath = "/youtube/v3/search?part=snippet&q="+q+"&key="+API_KEY+"&maxResults=10&type=video";

        //console.log(url);

        var options = {
            hostname: "www.googleapis.com",
            path: urlpath
        };

        https.get(options, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                res.json(parsed);
            });
        }).on('error', function(err){
            res.sendStatus(500);
        });
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