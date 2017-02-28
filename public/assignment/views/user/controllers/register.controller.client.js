(function(){
    angular
        .module("WebAppMaker")
        .controller("registerController", registerController);

    function registerController(UserService, $location) {
        var vm = this;
        vm.createUser = createUser;

        function createUser(newUser){
            if(newUser == null){
                vm.error = 'Empty Fields';
                return;
            }
            if(newUser.username == null || newUser.password == null || newUser.vpassword == null){
                vm.error = 'Empty Fields';
                return;
            }
            if(newUser.password != newUser.vpassword){
                vm.error = 'Password Mismatch';
                return;
            }
            UserService
                .findUserByUsername(newUser.username)
                .success(function () {
                    vm.error = "Sorry, that Username has been already taken.";
                })
                .error(function () {
                    UserService
                        .createUser(newUser)
                        .success(function (newUserId) {
                            $location.url('/user/' + newUserId);
                        })
                        .error(function () {
                            vm.error = "Sorry, failed to register";
                        });
                });
            /*UserService.createUser(newUser);
            $location.url('/user/' + newUser._id);*/
        }
    }
})();