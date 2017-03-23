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
                .success(function (existingUser) {
                    //if(existingUser){
                        vm.error = "Sorry, that Username has been already taken.";

                })
                .error(function () {
                    UserService
                        .createUser(newUser)
                        .success(function (newUser) {
                            $location.url('/user/' + newUser._id);
                        })
                        .error(function () {
                            vm.error = "Sorry, failed to register";
                        });
                });
            /*UserService
                .findUserByUsername(newUser.username)
                .success(function (user) {
                    console.log("controller:" + user);
                    vm.error = "Sorry, that Username has been already taken.";
                    return;
                });

            delete newUser.vpassword;
            UserService
                .createUser(newUser)
                .success(function (newUser) {
                    $location.url('/user/' + newUser._id);
                })
                .error(function () {
                    vm.error = "Sorry, failed to register";
                });*/
            /*UserService.createUser(newUser);
            $location.url('/user/' + newUser._id);*/
        }
    }
})();