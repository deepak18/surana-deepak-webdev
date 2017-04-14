/**
 * Created by Deepak on 4/7/2017.
 */

(function (app) {
    angular
        .module("MusicalTutorialApp")
        .controller("slideDetailsController", slideDetailsController);

    function slideDetailsController(SlideService,$routeParams, $location, $sce) {
        var vm = this;
        vm.slideID = $routeParams['slideID'];
        vm.slidetopic = $routeParams['slidetopic'];

        vm.getSlideShowEmbedUrl = getSlideShowEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.addSlidetoFavorites = addSlidetoFavorites;
        vm.removeSlidefromFavorites = removeSlidefromFavorites;
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

        function addSlidetoFavorites() {
            SlideService
                .addSlidetoFavorites(vm.slideID)
                .success(function (result) {
                    vm.favorites = true;
                })
                .error(function (err) {
                    vm.error = 'Adding to Favorites failed !';
                    vm.favorites = false;
                })
        }

        function removeSlidefromFavorites() {
            SlideService
                .removeSlidefromFavorites(vm.slideID)
                .success(function (result) {
                    vm.favorites = false;
                })
                .error(function (err) {
                    vm.error = 'Removing from Favorites failed !';
                    vm.favorites = true;
                })
        }

        function init(){
            SlideService
                .findSlideByID(vm.slideID)
                .success(renderSlide);

            SlideService
                .checkSlideinFavorites(vm.slideID)
                .success(function (result) {
                    vm.favorites = true;
                })
                .error(function (err) {
                    vm.favorites = false;
                });
        }
        init();

        function renderSlide(slide) {
            var obj = JSON.parse(slide);       // parsing the JSON string
        //    console.log(obj);
            vm.slide = obj.Slideshow;
            console.log(vm.slide);
            var relatedSlideshowsArray = vm.slide.RelatedSlideshows["0"].RelatedSlideshowID;

            vm.relatedSlideshowsID = [];
            vm.relatedSlides = [];

            // running through array of RelatedSlideshows
            $.each(relatedSlideshowsArray, function (index, value) {
            //   console.log(index + "  " + value._);
               vm.relatedSlideshowsID.push(value._);
                SlideService
                    .findSlideByID(value._)
                    .success(function (relatedSlide) {
                        var object = JSON.parse(relatedSlide);
                        vm.relatedSlides.push(object.Slideshow);
                    })

            });
            console.log(vm.relatedSlideshowsID);
        }

        function getSlideShowEmbedUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }
    }
})();