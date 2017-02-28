(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", WebsiteNewController);

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.createWebsite = createWebsite;

        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(renderWebsites);
        }
        init();

        function createWebsite (website) {
            WebsiteService
                .createWebsite(vm.userId, website)
                .success(function () {
                    //vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
                    $location.url("/user/"+vm.userId+"/website");
                })
                .error(function () {
                    vm.error = "Unable to create a new Website."
                })
        }

        function renderWebsites(websites) {
            vm.websites = websites;
        }
    }
})();