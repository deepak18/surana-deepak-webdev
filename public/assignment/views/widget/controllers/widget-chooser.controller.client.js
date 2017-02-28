(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetChooserController", WidgetChooserController);

    function WidgetChooserController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;

        vm.createWidget = createWidget;

        function createWidget(widgetType) {
            newWidget = {};
            newWidget._id =  (new Date()).getTime().toString();
            newWidget.widgetType = widgetType;

            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function () {
                    $location.url("/user/" + vm.userId +"/website/" +vm.websiteId + "/page/" + vm.pageId + "/widget/" + newWidget._id);
                })
                .error(function () {
                    vm.error ="Unable to create new Widget.";
                });
        }
    }
})();