(function () {
    angular
        .module("WebAppMaker")
        .controller("PageEditController" , PageEditController);
    
    function PageEditController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            PageService
                .findAllPagesForWebsite(vm.websiteId)
                .success(renderPages);

            PageService
                .findPageById(vm.pageId)
                .success(renderPageEditor);
        }
        init();

        function updatePage() {
            PageService
                .updatePage(vm.pageId, vm.page)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function () {
                    vm.error = "Unable to update the Page.";
                });
        }

        function deletePage(){
            PageService
                .deletePage(vm.pageId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                .error(function () {
                    vm.error = "Unable to delete Page.";
                });
        }

        function renderPageEditor(page) {
            vm.page = page;
        }

        function renderPages(pages) {
            vm.pages = pages;
        }
    }
})();
