(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController" , WebsiteListController);
    
    function WebsiteListController($routeParams, WebsiteService, UserService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        
        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(renderWebsite);

            UserService
                .findUserById(vm.userId)
                .success(getDeveloperName);
        }
        init();

        function renderWebsite(websites) {
            vm.websites = websites;
        }

        function getDeveloperName(user) {
            console.log(user);
            vm.developerName = user.firstName + " " + user.lastName;
        }
    }
})();