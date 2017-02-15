(function () {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService() {
        var websites = [
            { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem", "created": new Date()},
            { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem", "created": new Date()},
            { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem", "created": new Date()},
            { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem", "created": new Date()},
            { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem", "created": new Date()},
            { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem", "created": new Date()}
        ];
        var api = {
            "createWebsite": createWebsite,
            "findWebsitesByUser": findWebsitesByUser,
            "findWebsiteById": findWebsiteById,
            "updateWebsite": updateWebsite,
            "deleteWebsite": deleteWebsite
        };
        return api;

        function findWebsiteById(wid) {
            for(var w in websites) {
                if(websites[w]._id === wid) {
                    return angular.copy(websites[w]);
                }
            }
            return null;
        }
        function deleteWebsite(websiteId) {
            for(var w in websites) {
                if(websites[w]._id === websiteId) {
                    websites.splice(w, 1);
                }
            }
        }

        function updateWebsite(websiteId, newwebsite){
            for(w in websites){
                website = websites[w];
                if(website._id === websiteId){
                    website.name = newwebsite.name;
                    website.description = newwebsite.description;
                }
            }
        }

        function createWebsite(userId, website) {
            website.developerId = userId;
            website._id = (new Date()).getTime().toString();
            website.created = new Date();
            websites.push(website);
        }

        function findWebsitesByUser(userId) {
            var sites = [];
            for(var w in websites) {
                if(websites[w].developerId === userId) {
                    sites.push(websites[w]);
                }
            }
            return sites;
        }
    }
})();