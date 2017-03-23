(function () {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", FlickrImageSearchController);
    
    function FlickrImageSearchController(FlickrService,$routeParams, $location, WidgetService ) {
        var vm = this;
        var newWidget;

        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        function init() {
            vm.uid = $routeParams.uid;
            vm.pid = $routeParams.pid;
            vm.wid = $routeParams.wid;
            vm.wgid = $routeParams.wgid;
            WidgetService
                .findWidgetById(vm.wgid)
                .success(function (widget) {
                    newWidget = widget;
                });
        }
        init();

        function searchPhotos(searchTerm) {
            console.log(searchTerm);
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";

            newWidget.url = url;
          //  console.log(newWidget);

            WidgetService
                .updateWidget(vm.wgid, newWidget)
                .success(function() {
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget/" + vm.wgid);
                });
        }
    }
})();