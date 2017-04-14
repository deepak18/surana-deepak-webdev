(function(){
    angular
        .module("MusicalTutorialApp")
        .factory('UserService', userService);

    function userService($http) {

        var api = {
            "createUser" : createUser,
            "findUserById": findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser" : deleteUser,
            "login" : login,
            "checkLogin" : checkLogin,
            "checkAdmin" : checkAdmin,
            "logout" : logout,
            "findCurrentUser" : findCurrentUser,
            "getSHAhash" : getSHAhash
        };
        return api;

        function getSHAhash() {
            return $http.get("/api/getSHAhash");
        }

        function findCurrentUser() {
            return $http.get("/api/user");
        }
        
        function logout() {
            return $http.post("/api/logout");
        }

        function checkLogin() {
            return $http.post("/api/checkLogin");
        }

        function checkAdmin() {
            return $http.post("/api/checkAdmin");
        }

        function login(username, password) {
            var user = {
                username: username,
                password: password
            };
            return $http.post("/api/login", user);
        }

        function deleteUser(userId){
            return $http.delete('/api/user/'+userId);
            /* for(var u in users){
                if(users[u]._id === userId){
                    users.splice(u, 1);
                }
            }*/
        }

        function createUser(newUser){
            return $http.post("/api/user", newUser);
            /*newUser._id =(new Date()).getTime().toString();
            users.push(newUser);*/
        }

        function updateUser(newUser) {
            console.log("client updated user: " + newUser);
            return $http.put('/api/user/' + newUser._id, newUser);
            /*for(var u in users) {
                var user = users[u];
                if( user._id === userId ) {
                    users[u].firstName = newUser.firstName;
                    users[u].lastName = newUser.lastName;
                    return user;
                }
            }
            return null;*/
        }

        function findUserById(uid) {
            return $http.get("/api/user/"+uid);
            /*for(var u in users) {
                var user = users[u];
                if( user._id === uid ) {
                    return angular.copy(user);
                }
            }
            return null;*/
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username="+username+"&password="+password);
            /*for(var u in users) {
                var user = users[u];
                if( user.username === username &&
                    user.password === password) {
                    return angular.copy(user);
                }
            }
            return null;*/
        }

        function findUserByUsername(username){
            return $http.get("/api/user?username="+username);
            /*for(var u in users){
                var user = users[u];
                if(user.username === username) {
                    return angular.copy(user);
                }
            }*/
        }
    }
})();