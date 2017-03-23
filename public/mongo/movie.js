(function () {
    angular
        .module("MovieApp", [])
        .config(configuration)
        .controller("MovieController" , MovieController);

    function configuration($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
    }

    function MovieController($http) {
        var vm = this;
        vm.createMovie = createMovie;

        function createMovie(movie) {
            $http.post('/api/movie', movie);
        }
    }
})();
