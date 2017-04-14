/**
 * Created by Deepak on 4/7/2017.
 */

(function (app) {
    angular
        .module("MusicalTutorialApp")
        .controller("videoDetailsController", videoDetailsController);

    function videoDetailsController(VideoService,$routeParams, $location, $sce) {
        var vm = this;
        vm.videoID = $routeParams['videoID'];
        vm.videotopic = $routeParams['videotopic'];

        vm.searchType = null;

        vm.getSlideShowEmbedUrl = getSlideShowEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.addVideotoFavorites = addVideotoFavorites;
        vm.removeVideofromFavorites = removeVideofromFavorites;
        vm.searchResources = searchResources;

        $( document ).ready(function() {
            $('#submitTopic').attr('disabled', 'disabled');                      // Disables 'Go' button

            $('.dropdown').each(function (key, dropdown) {
                var $dropdown = $(dropdown);
                $dropdown.find('.dropdown-menu a').on('click', function () {
                    $dropdown.find('#choiceBox').text($(this).text()).append(' <span class="caret"></span>');
                    $('#submitTopic').removeAttr('disabled');               // Enables 'Go' button when a Type is selected
                });
            });
        });

        function searchResources(topic) {
            console.log(topic);
            console.log('/user/search/'+vm.searchType+'/'+topic);
            $location.url('/user/search/'+vm.searchType+'/'+topic);
        }

        function addVideotoFavorites() {
            VideoService
                .addVideotoFavorites(vm.videoID)
                .success(function (result) {
                    vm.favorites = true;
                })
                .error(function (err) {
                    vm.error = 'Adding to Favorites failed !';
                    vm.favorites = false;
                })
        }

        function removeVideofromFavorites() {
            VideoService
                .removeVideofromFavorites(vm.videoID)
                .success(function (result) {
                    vm.favorites = false;
                })
                .error(function (err) {
                    vm.error = 'Removing from Favorites failed !';
                    vm.favorites = true;
                })
        }

        function init(){
            VideoService
                .findVideoById(vm.videoID)
                .success(renderVideo);

            VideoService
                .findRelatedVideosByID(vm.videoID)
                .success(renderRelatedVideos);

            VideoService
                .checkVideoinFavorites(vm.videoID)
                .success(function (result) {
                    vm.favorites = true;
                })
                .error(function (err) {
                    vm.favorites = false;
                });
        }
        init();

        function renderRelatedVideos(result){
            vm.relatedVideos = result.items;
        }

        function renderVideo(video) {
            var videoLink = "https://www.youtube.com/embed/" + vm.videoID;
            vm.videoiframe = $sce.trustAsResourceUrl(videoLink);
            console.log(video.items[0]);
            vm.videoDetails = video.items[0];
        }

        function getSlideShowEmbedUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(youTubeID) {
            var url = "https://www.youtube.com/embed/" + youTubeID;
            return $sce.trustAsResourceUrl(url);
        }
    }
})();