(function () {
    angular
        .module("WebAppMaker")
        .controller("PageNewController" , PageNewController)
    
    function PageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        vm.createPage = createPage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function createPage(page) {
            PageService.createPage(vm.websiteId, page);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
        }
    }
})();
