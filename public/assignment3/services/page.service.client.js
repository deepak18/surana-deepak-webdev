(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
            { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
        ];

        var api = {
            "createPage": createPage,
            "findPageByWebsiteId": findPageByWebsiteId,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage": deletePage
        };
        return api;


        function deletePage(pageId) {
            for(var p in pages) {
                if(pages[p]._id === pageId) {
                    pages.splice(p, 1);
                }
            }
        }

        function updatePage(pageId, newPage){
            for(p in pages){
                page = pages[p];
                if(page._id === pageId){
                    page.name = newPage.name;
                    page.description = newPage.description;
                }
            }
        }

        function findPageById(pid) {
            for(var p in pages) {
                if(pages[p]._id === pid) {
                    return angular.copy(pages[p]);
                }
            }
            return null;
        }

        function createPage(websiteId, page) {
            page.websiteId = websiteId;
            page._id = (new Date()).getTime().toString();
            page.description = page.title;
            pages.push(page);
        }

        function findPageByWebsiteId(websiteId) {
            var pagesforWebsite = [];
            for(var p in pages) {
                if(pages[p].websiteId === websiteId) {
                    pagesforWebsite.push(pages[p]);
                }
            }
            return pagesforWebsite;
        }
    }
})();