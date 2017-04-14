/**
 * Created by Deepak on 3/25/2017.
 */

(function () {
    angular
        .module("MusicalTutorialApp")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
        //User Controller Configurations
            .when("/admin",{
                templateUrl: 'views/admin/user-list.view.client.html',
                resolve: {
                    adminUser: checkAdmin
                }
            })
            .when("/login",{
                templateUrl: 'views/user/templates/login.view.client.html',
                controller: 'loginController',
                controllerAs: 'model'
            })
            .when("/register",{
                templateUrl: 'views/user/templates/register.view.client.html',
                controller: 'registerController',
                controllerAs: 'model'
            })
            .when("/profile",{
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/user",{
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'profileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/user/search",{
                templateUrl: 'views/search/templates/search.view.html',
                controller: "tutorialSearchController",
                controllerAs: "model"
            })
            .when("/user/search/slide/:slidetopic",{
                templateUrl: 'views/search/templates/search.view.html',
                controller: "tutorialSearchController",
                controllerAs: "model"
            })
            .when("/user/search/video/:videotopic",{
                templateUrl: 'views/search/templates/search.view.html',
                controller: "tutorialSearchController",
                controllerAs: "model"
            })
            .when("/user/details/slide/:slideID/:slidetopic", {
                templateUrl: 'views/details/templates/slide-details.view.client.html',
                controller: "slideDetailsController",
                controllerAs: "model"
            })
            .when("/user/details/video/:videoID/:videotopic", {
                templateUrl: 'views/details/templates/video-details.view.client.html',
                controller: "videoDetailsController",
                controllerAs: "model"
            })
            .when("/user/dashboard",{
                templateUrl: 'views/dashboard/templates/dashboard.view.client.html',
                controller: "dashboardController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/user/dashboard/upload",{
                templateUrl: 'views/dashboard/templates/upload.view.client.html',
                controller: "uploadController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/user/favorite",{
                templateUrl: 'views/favorite/templates/favorite.view.html',
                controller: "favoriteController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            .otherwise({
                redirectTo: '/login'
            });

        function checkLogin($q, UserService, $location) {
            var deferred = $q.defer();
            UserService
                .checkLogin()
                .success(
                    function (user) {
                        if(user != '0'){
                            deferred.resolve(user);
                        } else {
                            deferred.reject();
                            $location.url("/login");
                        }
                    }
                );
            return deferred.promise;
        }

        function checkAdmin($q, UserService, $location) {
            var deferred = $q.defer();
            UserService
                .checkAdmin()
                .success(
                    function (user) {
                        if(user != '0'){
                            deferred.resolve(user);
                        } else {
                            deferred.reject();
                            $location.url("/profile");
                        }
                    }
                );
            return deferred.promise;
        }

    }
})();