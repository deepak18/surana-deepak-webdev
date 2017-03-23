(function(){
    angular
        .module("WebAppMaker")
        .controller("loginController", loginController);

    function loginController(UserService, $location) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if(user == null){
                vm.error = 'Empty Fields';
                return;
            }
            if(user.username == null || user.password == null){
                vm.error = 'Empty fields';
                return;
            }

            UserService
                .findUserByCredentials(user.username, user.password)
                .success(function (loginUser) {
                    if(loginUser){
                        $location.url('/user/' + loginUser._id);
                    }
                    else{
                        vm.error = 'No such User';
                    }
                })
                .error(function () {
                    vm.error = 'No such User';
                });
        }
    }
})();