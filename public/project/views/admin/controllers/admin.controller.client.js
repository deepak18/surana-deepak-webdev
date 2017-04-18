/**
 * Created by Deepak on 4/14/2017.
 */
(function () {
    angular
        .module("MusicalTutorialApp")
        .controller("adminController", adminController);

    function adminController(adminUser, UserService) {
        var vm = this;
        vm.deleteUser = deleteUser;
        vm.updateUserRole = updateUserRole;
        vm.user = adminUser;
        
        function init() {
            findAllUsers();
        }
        init();

        function findAllUsers() {
            UserService
                .findAllUsers()
                .then(renderUsers);
        }

        function renderUsers(response) {
            vm.users = response.data;
            console.log(vm.users);
        }

        function updateUserRole(user) {
            UserService
                .updateUserRole(user)
                .then(findAllUsers);
        }

        function deleteUser(user) {
            UserService
                .deleteUser(user._id)
                .then(findAllUsers);
        }
    }

})();