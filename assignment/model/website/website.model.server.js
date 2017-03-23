var mongoose = require('mongoose');
var websiteSchema = require('./website.schema.server');
var websiteModel = mongoose.model('WebAppWebsite', websiteSchema);
var q = require("q");

var userModel = require('../user/user.model.server');

websiteModel.createWebsiteForUser = createWebsiteForUser;
websiteModel.findAllWebsitesForUser = findAllWebsitesForUser;
websiteModel.findWebsiteById = findWebsiteById;
websiteModel.updateWebsite = updateWebsite;
websiteModel.deleteWebsite = deleteWebsite;

module.exports = websiteModel;

function deleteWebsite(websiteId) {
    var deffered = q.defer();

    websiteModel
        .findById(websiteId, function (err, website) {
            if(err){
                deffered.reject(err);
            }
            else {
                website.remove();
                deffered.resolve();
            }
        });
    return deffered.promise;
}

function updateWebsite(websiteId, updatedWebsite) {
    var deffered = q.defer();

    websiteModel
        .update({_id: websiteId},
            {$set:{name:updatedWebsite.name, description:updatedWebsite.description}},
            function (err, website){
                if(err){
                    deffered.reject(err);
                } else{
                    deffered.resolve(website);
                }
            });
    return deffered.promise;
}

function findWebsiteById(websiteId) {
    var deffered = q.defer();

    websiteModel
        .findById(websiteId, function (err, website) {
            if(err) {
                deffered.reject(err);
            } else{
                deffered.resolve(website);
            }
        });
    return deffered.promise;
}

function findAllWebsitesForUser(userId) {
    var deffered = q.defer();

    websiteModel
        .find({_user:userId}, function(err, websites) {
            if (err) {
                deffered.reject();
            }
            else {
                deffered.resolve(websites);
            }
        });
    return deffered.promise;
}

function createWebsiteForUser(userId, website) {
    var deffered = q.defer();
    website._user = userId;

    websiteModel
        .create(website, function(err, newWebsite){
            if(err){
                deffered.reject(err);
            } else{
                userModel
                    .findUserById(userId)
                    .then(function (user) {
                        user.websites.push(newWebsite._id);
                        user.save(function (err) {
                            if(err)
                                deffered.reject(err);
                            else
                                deffered.resolve(newWebsite);
                        });
                    });
                deffered.resolve();
            }
        });

    return deffered.promise;
}