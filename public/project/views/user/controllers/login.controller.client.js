/**
 * Created by Deepak on 3/25/2017.
 */

(function(){
    angular
        .module("MusicalTutorialApp")
        .controller("loginController", loginController);

    function loginController(UserService, $location) {   //UserService, $location
        var vm = this;
        vm.login = login;

        function login(user)
        {
            vm.error = null;
            console.log(user.username+ "  " +user.password);
            if(user)
                UserService
                    .login(user.username, user.password)
                    .then(
                        function(user)
                        {
                            if(user === '0'){
                                vm.error = "No such user";
                            } else{
                            //    $location.url("/user/" + user.data._id);
                                $location.url("/profile");
                            }
                        },
                        function(err) {
                            vm.error = err.data;
                            console.log(err);
                        }
                    );
        }
    }
})();