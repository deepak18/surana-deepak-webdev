(function(){
    angular
        .module("MusicalTutorialApp")
        .controller("registerController", registerController);

    function registerController(UserService, $location) {
        var vm = this;
        vm.createUser = createUser;

        function createUser(newUser){
            console.log(newUser);

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
                        console.log("existingUser");
                        vm.error = "Sorry, that Username has been already taken.";

                })
                .error(function () {
                    UserService
                        .createUser(newUser)
                        .success(function (newUser) {
                            $location.url('/profile');
                        })
                        .error(function (err) {
                            vm.error = err;
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