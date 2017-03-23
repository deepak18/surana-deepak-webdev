(function () {
    angular
        .module('WebAppMaker')
        .directive('dsSortable', sortableDir);

    function sortableDir(WidgetService, $routeParams) {
        function linkFunc(scope, element, attributes) {
            var index1, index2;
            var pid = $routeParams.pid;

            element.sortable({
                axis: 'y',
                handle: '.ds-sortablehandle',

                start: function(event, ui) {
                    index1 = ui.item.index();
                },

                stop: function(event, ui) {
                    index2 = ui.item.index();
                    WidgetService
                        .reorderWidget(pid, index1, index2)
                        .success(function() {
                            console.log("Successfully updated");
                        })
                }
            });
        }
        return {
            link: linkFunc
        };
    }
})();