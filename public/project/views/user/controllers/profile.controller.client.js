(function(){
    angular
        .module("MusicalTutorialApp")
        .controller("profileController", profileController);

    function profileController($routeParams, UserService, $location) {
        var vm = this;

        vm.unregisterUser = unregisterUser;
        vm.update = update;
        vm.logout = logout;

        function init(){
            UserService
            //    .findUserById(userId)
                .findCurrentUser()
                .success(renderUser);
        }
        init();

        function renderUser(user){
            vm.user = user;
        }

        function logout() {
            gapi.auth.signOut();
            UserService
                .logout()
                .success(function () {
                    $location.url("/login");
                });
        }

        function unregisterUser() {
            var answer = confirm("Are you sure?");
            if(answer){
                UserService
                    .unregisterUser(vm.user._id)
                    .success(function () {
                        $location.url('/login');
                    })
                    .error(function () {
                        vm.error = 'Unable to Unregister user';
                    })
            } else{
                $location.url('/profile');
            }
        }

        function update(newUser) {
            UserService
                .updateUser(newUser)
                .then(function () {
                    vm.message = 'Profile successfully updated';
                }, function () {
                    vm.error = 'Unable to update profile';
                });
        }
    }
})();