/**
 * Created by Deepak on 4/6/2017.
 */

(function() {
    angular
        .module("MusicalTutorialApp")
        .factory('SlideService', SlideService);

    function SlideService($http) {

        var api = {
            "getSlidesByTopic" : getSlidesByTopic,
            "findSlideByID" : findSlideByID,
            "checkSlideinFavorites" : checkSlideinFavorites,
            "addSlidetoFavorites" : addSlidetoFavorites,
            "removeSlidefromFavorites" : removeSlidefromFavorites
        };
        return api;

        function removeSlidefromFavorites(slideID) {
            return $http.delete('/api/slides/favorites/'+slideID);
        }

        function addSlidetoFavorites(slideID) {
            return $http.post('/api/slides/favorites/'+slideID);
        }

        function checkSlideinFavorites(slideID) {
            return $http.get('/api/slides/favorites/'+slideID);
        }

        function getSlidesByTopic(topic) {
            return $http.get('/api/slides/'+topic);
        }

        function findSlideByID(slideID) {
            return $http.get('/api/slides/details/'+slideID);
        }
    }
})();