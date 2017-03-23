var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('WebAppUser', userSchema);
var q = require("q");

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findUserByUsername = findUserByUsername;
userModel.findUserByCredentials = findUserByCredentials;
userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;

module.exports = userModel;

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

function updateUser(userId, updatedUser) {
    var deffered = q.defer();

    userModel
        .update({_id: userId},
            {$set: {username: updatedUser.username,
                    firstName: updatedUser.firstName,
                    lastName : updatedUser.lastName,
                    email : updatedUser.email}}, function (err, user){
                if(err){
                    deffered.reject(err);
                } else{
                    deffered.resolve(user);
                }
            });
    return deffered.promise;
}

function findUserByCredentials(username, password) {
    var deffered = q.defer();

    userModel
        .find({username: username, password: password}, function (err,user) {
            if(err){
                deffered.reject(err);
            }else{
                //console.log(user);
                deffered.resolve(user[0]);
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

function createUser(user) {
    var deffered = q.defer();
    userModel
        .create(user, function (err, user) {
            if(err){
                deffered.reject(err);
            }else {
                deffered.resolve(user);
            }
        });
    return deffered.promise;
}