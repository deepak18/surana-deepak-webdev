(function() {
    angular
        .module("WebAppMaker")
        .service("FlickrService", FlickrService);


    function FlickrService($http) {
        var key = "c3160fa3f43f3b10ced5d4222d86c0b5";
        var secret = "d0e086e68d098fa6";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";

        this.searchPhotos = searchPhotos;

        function searchPhotos(searchTerm) {

            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();