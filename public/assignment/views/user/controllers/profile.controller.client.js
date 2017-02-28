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
            UserService
                .findUserById(userId)
                .success(renderUser);
        }
        init();

        function renderUser(user){
            vm.user = user;
        }

        function deleteUser() {
            var answer = confirm("Are you sure?");
            if(answer){
                UserService.
                    deleteUser(userId)
                    .success(function () {
                        $location.url('/login');
                    })
                    .error(function () {
                        vm.error = 'Unable to Unregister user';
                    })
            }

        }

        function update(newUser) {
            UserService
                .updateUser(userId, newUser)
                .success(function () {
                    vm.message = "Successfully Updated.";
                })
                .error(function () {
                    vm.error = "Unable to Update user.";
                });
        }
    }
})();