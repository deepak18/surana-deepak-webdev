(function(){
    angular
        .module("WebAppMaker")
        .factory('UserService', userService);

    function userService($http) {

        var api = {
            "createUser" : createUser,
            "findUserById": findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser" : deleteUser
        };
        return api;

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

        function updateUser(userId, newUser) {
            return $http.put("/api/user/"+userId, newUser);
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