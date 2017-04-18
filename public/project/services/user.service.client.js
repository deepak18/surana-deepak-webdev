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
            "findAllUsers" : findAllUsers,
            "updateUser": updateUser,
            "updateUserRole": updateUserRole,
            "unregisterUser": unregisterUser,
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
            return $http.delete('/api/admin/user/'+userId);
        }

        function unregisterUser(userId) {
            return $http.delete('/api/user/'+userId);
        }

        function createUser(newUser){
            return $http.post("/api/user", newUser);
        }

        function updateUser(newUser) {
            return $http.put('/api/user/' + newUser._id, newUser);
        }

        function updateUserRole(user) {
            return $http.put('/api/admin/user/' + user._id, user);
        }

        function findUserById(uid) {
            return $http.get("/api/user/"+uid);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username="+username+"&password="+password);
        }

        function findUserByUsername(username){
            return $http.get("/api/user?username="+username);
        }
        
        function findAllUsers() {
            return $http.get("/api/admin/users");
        }
    }
})();