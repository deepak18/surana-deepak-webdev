var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('MusicalTutorialApp', userSchema);
var q = require("q");

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findUserByUsername = findUserByUsername;
userModel.findUserByCredentials = findUserByCredentials;
userModel.findAllUsers = findAllUsers;
userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.findUserBySpotifyId = findUserBySpotifyId;

userModel.checkSlideinFavorites = checkSlideinFavorites;
userModel.checkVideoinFavorites = checkVideoinFavorites;

userModel.addSlidetoFavorites = addSlidetoFavorites;
userModel.addVideotoFavorites = addVideotoFavorites;

userModel.removeSlidefromFavorites = removeSlidefromFavorites;
userModel.removeVideofromFavorites = removeVideofromFavorites;

userModel.updateToken = updateToken;

module.exports = userModel;


function removeSlidefromFavorites(slideID, userID) {
    var deffered = q.defer();

    userModel
        .findById(userID, function (err, user) {
            if(err){
                deffered.reject(err);
            } else {
                var index = user.slides.indexOf(slideID);
                if(index > -1) {
                    user.slides.splice(index, 1);
                    user.save();
                }
                deffered.resolve(user);
            }
        });
    return deffered.promise;
}

function removeVideofromFavorites(videoID, userID) {
    var deffered = q.defer();

    userModel
        .findById(userID, function (err, user) {
            if(err){
                deffered.reject(err);
            } else {
                var index = user.videos.indexOf(videoID);
                if(index > -1) {
                    user.videos.splice(index, 1);
                    user.save();
                }
                deffered.resolve(user);
            }
        });
    return deffered.promise;
}

function addSlidetoFavorites(slideID, userID) {
    var deffered = q.defer();

    userModel
        .findById(userID, function (err, user) {
            if(err){
                deffered.reject(err);
            } else {
                user.slides.push(slideID);
                user.save();
                deffered.resolve(user);
            }
        });
    return deffered.promise;
}

function addVideotoFavorites(videoID, userID) {
    var deffered = q.defer();

    userModel
        .findById(userID, function (err, user) {
            if(err){
                deffered.reject(err);
            } else {
                console.log("model videoid: "+ videoID);

                user.videos.push(videoID);
                user.save();
                console.log("model user: " + user);
                deffered.resolve(user);
            }
        });
    return deffered.promise;
}

function checkVideoinFavorites(videoID, userID) {
    var deffered = q.defer();

    userModel
        .find({_id: userID, videos : videoID}, function (err, user) {
            if(err){
                deffered.reject(err);
            } else {
                deffered.resolve(user[0]);
            }
        });
    return deffered.promise;
}

function checkSlideinFavorites(slideID, userID) {
    var deffered = q.defer();

    userModel
        .find({_id: userID, slides : slideID}, function (err, user) {
            if(err){
                deffered.reject(err);
            } else {
                deffered.resolve(user[0]);
            }
        });
    return deffered.promise;
}

function findUserBySpotifyId(spotifyID) {
    return userModel.find({"spotify.id" : spotifyID});
}

function findUserByGoogleId(googleID) {
    return userModel.findOne({"google.id" : googleID});
}

function deleteUser(userId){
    var deffered = q.defer();

    userModel
        .findById(userId, function (err, user) {
            if(err){
                deffered.reject(err);
            } else{
                user.remove();
                deffered.resolve();
            }
        });
    return deffered.promise;
}

function updateUser(userId, user) {
    console.log(user);
    return userModel.update({_id: user._id}, {$set: user});
}

function updateToken(user, token) {
    return userModel.update({_id: user._id}, {$set: {"google.token" : token}});
}

function findUserByCredentials(username, password) {
    var deffered = q.defer();

    userModel
        .findOne({username: username, password: password}, function (err,user) {
            if(err){
                deffered.reject(err);
            }else{
                //console.log(user);
                deffered.resolve(user);
            }
        });
    return deffered.promise;
}

function findUserByUsername(username) {
    var deffered = q.defer();

    userModel
        .find({username: username}, function (err, user) {
            if(err){
                deffered.reject(err);
            }else{
                deffered.resolve(user[0]);
            }
        });

    return deffered.promise;
}

function findUserById(userId){
    var deffered = q.defer();

    userModel
        .findById(userId, function (err, user) {
            if(err){
                deffered.reject(err);
            } else{
               // console.log("Render user: " + user);
                deffered.resolve(user);
            }
        });

    return deffered.promise;
}

function findAllUsers() {
    return userModel.find();
}

function createUser(user) {
    console.log("model user:" + user.google.id);
    var deffered = q.defer();
    userModel
        .create(user, function (err, user) {
            if(err){
                console.log("exists model");
                deffered.reject(err);
            }else {

                deffered.resolve(user);
            }
        });
    return deffered.promise;

}
