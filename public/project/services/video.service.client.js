/**
 * Created by Deepak on 4/6/2017.
 */

(function() {
    angular
        .module("MusicalTutorialApp")
        .factory('VideoService', VideoService);

    function VideoService($http) {

        var api = {
            "getVideosByTopic" : getVideosByTopic,
            "findVideoById" : findVideoById,
            "findRelatedVideosByID" : findRelatedVideosByID,
            "checkVideoinFavorites" : checkVideoinFavorites,
            "addVideotoFavorites" : addVideotoFavorites,
            "removeVideofromFavorites" : removeVideofromFavorites
        };
        return api;

        function removeVideofromFavorites(videoID) {
            return $http.delete('/api/videos/favorites/'+videoID);
        }

        function addVideotoFavorites(videoID) {
            return $http.post('/api/videos/favorites/'+videoID);
        }

        function checkVideoinFavorites(videoID) {
            return $http.get('/api/videos/favorites/'+videoID);
        }

        function getVideosByTopic(topic) {
            return $http.get('/api/videos/'+topic);
        }

        function findVideoById(videoID) {
            return $http.get('/api/videos/details/'+videoID);
        }
        function findRelatedVideosByID(videoID) {
            return $http.get('/api/videos/related/'+videoID);
        }
    }
})();