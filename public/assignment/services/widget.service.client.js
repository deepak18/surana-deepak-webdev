(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {

        var api = {
            "createWidget": createWidget,
            "findAllWidgetsForPage": findAllWidgetsForPage,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget,
            "reorderWidget": reorderWidget
        };
        return api;

        function deleteWidget(widgetId) {
            return $http.delete("/api/widget/"+widgetId);

            /*for(var w in widgets) {
                if(widgets[w]._id === widgetId) {
                    widgets.splice(w, 1);
                }
            }*/
        }

        function createWidget(pageId, newWidget) {
            return $http.post("/api/page/"+pageId+"/widget", newWidget);

            /*newWidget.pageId = pageId;
            switch(newWidget.widgetType){
                case "HEADER":
                    newWidget.text = "Default Text";
                    newWidget.size = 3;
                    break;
                case "IMAGE":
                    newWidget.width = "100%";
                    newWidget.url = "http://lorempixel.com/";
                    break;
                case "YOUTUBE":
                    newWidget.width = "100%";
                    newWidget.url = "http://lorempixel.com/";
                    break;
                case "HTML":
                    newWidget.text = "Default Text";
                    break;
            }
            widgets.push(newWidget);*/
        }

        function updateWidget(widgetId, newWidget){
            return $http.put("/api/widget/"+widgetId, newWidget);

            /*for(w in widgets){
                widget = widgets[w];
                if(widget._id === widgetId){
                    switch(widget.widgetType){
                        case "HEADER":
                            widget.text = newWidget.text;
                            widget.size = newWidget.size;
                            break;
                        case "IMAGE":
                            widget.width = newWidget.width;
                            widget.url = newWidget.url;
                            break;
                        case "YOUTUBE":
                            widget.width = newWidget.width;
                            widget.url = newWidget.url;
                            break;
                        case "HTML":
                            widget.text = newWidget.text;
                            break;
                    }
                }
            }*/
        }

        function findWidgetById(widgetId) {
            return $http.get("/api/widget/"+widgetId);

            /*for(var w in widgets) {
                if(widgets[w]._id === widgetId) {
                    return angular.copy(widgets[w]);
                }
            }
            return null;*/
        }

        function findAllWidgetsForPage(pageId) {
            return $http.get("/api/page/"+pageId+"/widget");

            /*var widgetsforPage = [];
            for(var w in widgets) {
                if(widgets[w].pageId === pageId) {
                    widgetsforPage.push(widgets[w]);
                }
            }
            return widgetsforPage;*/
        }

        function reorderWidget(pageId, index1, index2) {
            return $http.put("/page/" + pageId + "/widget?initial=" + index1 + "&final=" + index2);
        }
    }
})();