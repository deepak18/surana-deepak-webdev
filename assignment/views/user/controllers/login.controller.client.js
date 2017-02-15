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
            var loginUser = UserService.findUserByCredentials(user.username, user.password);
            if(loginUser != null) {
                $location.url('/user/' + loginUser._id);
            } else {
                vm.error = 'No such user.';
            }
        }
    }
})();