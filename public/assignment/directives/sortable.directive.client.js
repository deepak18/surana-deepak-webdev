(function () {
    angular
        .module('WebAppMaker')
        .directive('dsSortable', sortableDir);

    function sortableDir() {
        function linkFunc(scope, element, attributes) {
            element.sortable({
                axis: 'y',
                handle: '.ds-sortablehandle'
            });
        }
        return {
            link: linkFunc
        };
    }
})();