var mongoose = require('mongoose');
var pageSchema = require('./page.schema.server');
var pageModel = mongoose.model('WebAppPage', pageSchema);
var q = require('q');

var websiteModel = require('../website/website.model.server');

pageModel.createPage = createPage;
pageModel.findAllPagesForWebsite = findAllPagesForWebsite;
pageModel.findPageById = findPageById;
pageModel.updatePage = updatePage;
pageModel.deletePage = deletePage;

module.exports = pageModel;

function deletePage(pageId) {
    var deffered = q.defer();

    pageModel
        .findById(pageId, function (err, page){
           if(err){
               deffered.reject(err);
           } else{
               page.remove();
               deffered.resolve();
           }
        });
    return deffered.promise;
}

function updatePage(pageId, updatedPage) {
    var deffered = q.defer();

    pageModel
        .update({_id: pageId},
            {$set:{name:updatedPage.name, description:updatedPage.description}},
            function (err, page){
                if(err){
                    deffered.reject(err);
                } else{
                    deffered.resolve(page);
                }
            });
    return deffered.promise;
}

function findPageById(pageId) {
    var deffered = q.defer();

    pageModel
        .findById(pageId, function (err, page) {
            if(err){
                deffered.reject(err);
            } else{
                deffered.resolve(page);
            }
        });

    return deffered.promise;
}

function findAllPagesForWebsite(websiteId) {
    var deffered = q.defer();

    pageModel
        .find({_website:websiteId}, function(err, pages) {
            if (err) {
                deffered.reject();
            }
            else {
                deffered.resolve(pages);
            }
        });
    return deffered.promise;

}
function createPage(websiteId, page) {
    var deffered = q.defer();
    page._website = websiteId;

    pageModel
        .create(page, function(err, newPage) {
            if (err) {
                deffered.reject(err);
            }
            else {
                websiteModel
                    .findWebsiteById(websiteId)
                    .then(function(website) {
                        website.pages.push(newPage._id);
                        website.save();
                    });
                deffered.resolve();
            }
        });
    return deffered.promise;
}