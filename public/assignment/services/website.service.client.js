(function () {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService($http) {

        var api = {
            "createWebsite": createWebsite,
            "findAllWebsitesForUser": findAllWebsitesForUser,
            "findWebsiteById": findWebsiteById,
            "updateWebsite": updateWebsite,
            "deleteWebsite": deleteWebsite
        };
        return api;

        function findWebsiteById(wid) {
            return $http.get("/api/website/" + wid);

            /*for(var w in websites) {
                if(websites[w]._id === wid) {
                    return angular.copy(websites[w]);
                }
            }
            return null;*/
        }
        function deleteWebsite(websiteId) {
            return $http.delete("/api/website/"+websiteId);

            /*for(var w in websites) {
                if(websites[w]._id === websiteId) {
                    websites.splice(w, 1);
                }
            }*/
        }

        function updateWebsite(websiteId, newWebsite){
            return $http.put("/api/website/" + websiteId, newWebsite);

            /*for(w in websites){
                website = websites[w];
                if(website._id === websiteId){
                    website.name = newWebsite.name;
                    website.description = newWebsite.description;
                }
            }*/
        }

        function createWebsite(userId, website) {
            return $http.post("/api/user/" + userId + "/website", website);

            /*website.developerId = userId;
            website._id = (new Date()).getTime().toString();
            website.created = new Date();
            websites.push(website);*/
        }

        function findAllWebsitesForUser(userId) {
            return $http.get("/api/user/"+userId+"/website");

            /*var sites = [];
            for(var w in websites) {
                if(websites[w].developerId === userId) {
                    sites.push(websites[w]);
                }
            }
            return sites;*/
        }
    }
})();