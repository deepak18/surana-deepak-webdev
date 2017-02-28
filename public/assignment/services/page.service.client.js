(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http) {

        var api = {
            "createPage": createPage,
            "findAllPagesForWebsite": findAllPagesForWebsite,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage": deletePage
        };
        return api;


        function deletePage(pageId) {
            return $http.delete("/api/page/"+pageId);

            /*for(var p in pages) {
                if(pages[p]._id === pageId) {
                    pages.splice(p, 1);
                }
            }*/
        }

        function updatePage(pageId, newPage) {
            return $http.put("/api/page/"+pageId, newPage);

            /*for (p in pages) {
                page = pages[p];
                if (page._id === pageId) {
                    page.name = newPage.name;
                    page.description = newPage.description;
                }
            }*/
        }

        function createPage(websiteId, newPage) {
            return $http.post("/api/website/"+websiteId+"/page", newPage);

            /*page.websiteId = websiteId;
            page._id = (new Date()).getTime().toString();
            page.description = page.title;
            pages.push(page);*/
        }

        function findPageById(pid) {
            return $http.get("/api/page/"+pid);

            /*for(var p in pages) {
                if(pages[p]._id === pid) {
                    return angular.copy(pages[p]);
                }
            }
            return null;*/
        }

        function findAllPagesForWebsite(websiteId) {
            return $http.get("/api/website/"+websiteId+"/page");

            /*var pagesforWebsite = [];
            for(var p in pages) {
                if(pages[p].websiteId === websiteId) {
                    pagesforWebsite.push(pages[p]);
                }
            }
            return pagesforWebsite;*/
        }
    }
})();