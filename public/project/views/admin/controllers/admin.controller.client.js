/**
 * Created by Deepak on 4/14/2017.
 */
(function () {
    angular
        .module("MusicalTutorialApp")
        .controller("adminController", adminController);

    function adminController(UserService) {
        var vm = this;
        
        function init() {
            UserService
                .findAllUsers()
                .then(renderUsers);
        }
        init();
        
        function renderUsers(response) {
            vm.users = response.data;
            console.log(vm.users);
        }
    }

})();