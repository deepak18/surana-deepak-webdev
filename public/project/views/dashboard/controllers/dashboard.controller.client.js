/**
 * Created by Deepak on 4/7/2017.
 */

(function (app) {
    angular
        .module("MusicalTutorialApp")
        .controller("dashboardController", dashboardController);

    function dashboardController($sce) {
        var vm = this;

        // The client ID is obtained from the {{ Google Cloud Console }}
        // at {{ https://cloud.google.com/console }}.
        // If you run this code from a server other than http://localhost,
        // you need to register your own client ID.
        var OAUTH2_CLIENT_ID = '226290814945-7ra1u75agakr0f830h9k170boom8f4ud.apps.googleusercontent.com';
        var OAUTH2_SCOPES = [
            'https://www.googleapis.com/auth/youtube'
        ];

        // Upon loading, the Google APIs JS client automatically invokes this callback.
        googleApiClientReady = function() {
            gapi.auth.init(function() {
                window.setTimeout(checkAuth, 1);
            });
        };

        // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
        // If the currently logged-in Google Account has previously authorized
        // the client specified as the OAUTH2_CLIENT_ID, then the authorization
        // succeeds with no user intervention. Otherwise, it fails and the
        // user interface that prompts for authorization needs to display.
        function checkAuth() {
            gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: true
            }, handleAuthResult);
        }

        // Handle the result of a gapi.auth.authorize() call.
        function handleAuthResult(authResult) {
            if (authResult && !authResult.error) {
                // Authorization was successful. Hide authorization prompts and show
                // content that should be visible after authorization succeeds.
                $('.pre-auth').hide();
                $('.post-auth').show();
                loadAPIClientInterfaces();
            } else {
                // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
                // client flow. The current function is called when that flow completes.
                $('#login-link').click(function() {
                    gapi.auth.authorize({
                        client_id: OAUTH2_CLIENT_ID,
                        scope: OAUTH2_SCOPES,
                        immediate: false
                    }, handleAuthResult);
                });
            }
        }

        // Load the client interfaces for the YouTube Analytics and Data APIs, which
        // are required to use the Google APIs JS client. More info is available at
        // https://developers.google.com/api-client-library/javascript/dev/dev_jscript#loading-the-client-library-and-the-api
        function loadAPIClientInterfaces() {
            gapi.client.load('youtube', 'v3', function() {
                handleAPILoaded();
            });
        }

        // Define some variables used to remember state.
        var playlistId, nextPageToken, prevPageToken;

        // After the API loads, call a function to get the uploads playlist ID.
        function handleAPILoaded() {
            requestUserUploadsPlaylistId();
        }

        // Call the Data API to retrieve the playlist ID that uniquely identifies the
        // list of videos uploaded to the currently authenticated user's channel.
        function requestUserUploadsPlaylistId() {
            // See https://developers.google.com/youtube/v3/docs/channels/list
            var request = gapi.client.youtube.channels.list({
                mine: true,
                part: 'contentDetails'
            });
            request.execute(function(response) {
                playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
                requestVideoPlaylist(playlistId);
            });
        }

        // Retrieve the list of videos in the specified playlist.
        function requestVideoPlaylist(playlistId, pageToken) {
        //    $('#video-container').html('');
            var requestOptions = {
                playlistId: playlistId,
                part: 'snippet',
                maxResults: 10
            };
            if (pageToken) {
                requestOptions.pageToken = pageToken;
            }
            var request = gapi.client.youtube.playlistItems.list(requestOptions);
            request.execute(function(response) {
                // Only show pagination buttons if there is a pagination token for the
                // next or previous page of results.
                nextPageToken = response.result.nextPageToken;
                var nextVis = nextPageToken ? 'visible' : 'hidden';
                $('#next-button').css('visibility', nextVis);
                prevPageToken = response.result.prevPageToken;
                var prevVis = prevPageToken ? 'visible' : 'hidden';
                $('#prev-button').css('visibility', prevVis);

                var playlistItems = response.result.items;
                if (playlistItems) {
                    $.each(playlistItems, function(index, item) {
                        displayResult(item.snippet);
                    });
                } else {
                    $('#video-container').html('Sorry you have no uploaded videos');
                }
            });
        }

        // Create a listing for a video.
        function displayResult(videoSnippet) {
            var title = videoSnippet.title;
            var videoId = videoSnippet.resourceId.videoId;

           $('#video-container').append('<h3> Title: ' + title + '</h3>');
           $('#video-container').append('<h3> YouTube Video ID:  ' + videoId + '</h3>');

            var makediv = document.createElement("div");
            makediv.style.paddingBottom = "56.25%";
            makediv.style.height = "0";
            makediv.style.position = "relative";

            var link = "https://www.youtube.com/embed/"+videoId;
            var makeIframe = document.createElement('iframe');
            makeIframe.frameBorder=0;
            makeIframe.width = "640px";
            makeIframe.height = "360px";
            makeIframe.style.width="100%";
            makeIframe.style.height="100%";
            makeIframe.style.position="absolute";
            makeIframe.setAttribute("src", link);
            makeIframe.setAttribute("allowfullscreen", '');

            makediv.appendChild(makeIframe);

            $('#video-container').append(makediv);
            $('#video-container').append('<hr>');
        }

        // Retrieve the next page of videos in the playlist.
        function nextPage() {
            requestVideoPlaylist(playlistId, nextPageToken);
        }

        // Retrieve the previous page of videos in the playlist.
        function previousPage() {
            requestVideoPlaylist(playlistId, prevPageToken);
        }

        function getYouTubeEmbedUrl(videoId) {
            var url = "https://www.youtube.com/embed/" + videoId;

            return $sce.trustAsResourceUrl(url);
        }




        /*var vm = this;

        vm.getSlideShowEmbedUrl = getSlideShowEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.addSlidetoFavorites = addSlidetoFavorites;
        vm.removeSlidefromFavorites = removeSlidefromFavorites;
        vm.searchResources = searchResources;

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
        }*/
    }
})();