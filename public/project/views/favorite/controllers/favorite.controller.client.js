/**
 * Created by Deepak on 3/25/2017.
 */
(function (app) {
    angular
        .module("MusicalTutorialApp")
        .controller("favoriteController", favoriteController);

    function favoriteController(currentUser, UserService, SlideService, $routeParams, $sce, $location) {
        var vm = this;
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;

        function init() {
            UserService
                .findUserById(currentUser._id)
                .success(renderUser);
        }
        init();

        function renderUser(user) {
            console.log(user);
            vm.user = user;

            getAllFavoriteVideos();
            getAllFavoriteSlides();
        }

        function getAllFavoriteVideos() {
            vm.favoriteVideos = vm.user.videos;
            console.log(vm.favoriteVideos);
        }

        function getAllFavoriteSlides() {
            var slideIDArray = vm.user.slides;
            vm.favoriteSlides = [ ];

            $.each(slideIDArray, function (index, value) {
                  console.log(index + "  " + value);
                SlideService
                    .findSlideByID(value)
                    .success(function (slide) {
                        var object = JSON.parse(slide);
                        vm.favoriteSlides.push(object.Slideshow);
                    })

            });
            console.log(vm.favoriteSlides);
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(youTubeID) {
            var url = "https://www.youtube.com/embed/" + youTubeID;
            return $sce.trustAsResourceUrl(url);
        }

        /*vm.searchYouTube = searchYouTube;
        vm.searchSlideShare = searchSlideShare;
        vm.searchResources = searchResources;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getConfirmation = getConfirmation;

        vm.showSlideResult = false;
        vm.showVideoResult = false;
        vm.searchType = null;

        $( document ).ready(function() {
            $('#submitTopic').attr('disabled', 'disabled');                      // Disables 'Go' button

            $('.dropdown').each(function (key, dropdown) {
                var $dropdown = $(dropdown);
                $dropdown.find('.dropdown-menu a').on('click', function () {
                    $dropdown.find('button').text($(this).text()).append(' <span class="caret"></span>');
                    $('#submitTopic').removeAttr('disabled');               // Enables 'Go' button when a Type is selected
                });
            });
        });

        var slidetopic = $routeParams.slidetopic;
        var videotopic = $routeParams.videotopic;

        function init() {
            if(slidetopic){
                vm.searchType = 'slide';
                vm.topic = slidetopic;
                searchResources(slidetopic);
                $('#submitTopic').removeAttr('disabled');
            }
            else if(videotopic){
                vm.searchType = 'video';
                vm.topic = videotopic;
                searchResources(videotopic);
                $('#submitTopic').removeAttr('disabled');
            }
        }
        init();



        function searchResources(topic) {
            vm.error = null;
            if(vm.searchType == 'video'){
                searchYouTube(topic);
            } else if(vm.searchType == 'slide'){
                searchSlideShare(topic);
            }
        }

        function searchSlideShare(topic) {
            SlideService
                .getSlidesByTopic(topic)
                .success(function (result) {
                    var obj = JSON.parse(result);       // parsing the JSON string
                    console.log(obj);
                    vm.slides = obj.Slideshows.Slideshow;
                    vm.showVideoResult = false;
                    vm.showSlideResult = true;
                    $location.url('/user/search/slide/'+topic);
                })
                .error(function () {
                    vm.error = "Sorry, unable to look up any Slides !"
                });
        }


        function searchYouTube(topic) {
            var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+topic+"&key=AIzaSyD0_FrI0nPWEedHXmYXo2YY_31oWBTEG3o&maxResults=10";

            VideoService
                .getVideosByTopic(topic)
                .success(function (result) {
                    vm.videos = result.items;
                    console.log(vm.videos);
                    vm.showSlideResult = false;
                    vm.showVideoResult = true;
                    $location.url('/user/search/video/'+topic);
                })
                .error(function (err) {
                    vm.error = 'Sorry, unable to look up any Videos !';
                });
        }

        function getConfirmation(){
            var retVal = confirm("Do you want to logout ?");
            if( retVal == true ){
                UserService
                    .logout()
                    .success(function () {
                        $location.url("/login");
                    });
            }
            else{
                return false;
            }
        }*/

    }
})();