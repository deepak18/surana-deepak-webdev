(function(){
    angular
        .module("WebAppMaker")
        .controller("profileController", profileController);

    function profileController($routeParams, UserService, $location) {
        var vm = this;
        var userId = $routeParams['uid'];

        vm.deleteUser = deleteUser;
        vm.update = update;

        function init(){
            vm.user = UserService.findUserById(userId);
        }
        init();

        function deleteUser() {
            UserService.deleteUser(userId);
            $location.url('/login');
        }

        function update(newUser) {
            var user = UserService.updateUser(userId, newUser);
            if(user == null) {
                vm.error = "Unable to update user";
            } else {
                vm.message = "User successfully updated"
            }
        }
    }
})();