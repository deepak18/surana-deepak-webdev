(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteEditController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(renderWebsites);

            WebsiteService
                .findWebsiteById(vm.websiteId)
                .success(renderWebsiteEditor);
        }
        init();

        function updateWebsite() {
            WebsiteService
                .updateWebsite(vm.websiteId, vm.website)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function () {
                    vm.error = "Unable to update Website."
                });
        }

        function deleteWebsite () {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function () {
                    vm.error = "Unable to delete Website.";
                });
        }

        function renderWebsiteEditor(website) {
            vm.website = website;
        }
        function renderWebsites(websites) {
            vm.websites = websites;
        }
    }
})();