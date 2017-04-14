/**
 * Created by Deepak on 3/25/2017.
 */
(function (app) {
    angular
        .module("MusicalTutorialApp")
        .controller("tutorialSearchController", tutorialSearchController);

    function tutorialSearchController(UserService, SlideService, VideoService, $routeParams, $sce, $location) {
        var vm = this;

        vm.searchYouTube = searchYouTube;
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

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

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
        }

    }
})();