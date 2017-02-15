(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService() {
        var widgets = [
            { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "Cricket"},
            { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 3, "text": "How about having specialists at short leg?"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://www.espncricinfo.com/db/PICTURES/CMS/256800/256891.3.jpg"},
            { "_id": "456", "widgetType": "HTML", "pageId": "321",
                "text": '<p>"To be poor at short leg does not excuse you; to be good at it condemns you there for longer". <br> \
                        The captain\'s phrasing may vary from region to region, but any youngster or newcomer to a cricket team knows the question. \
                        For the sake of accuracy, it\'s less a question than a veiled instruction, polished with hollow concern. \
                        It rarely matters if you\'re "not right" to field in close. Very few are. \
                        And that\'s the point: a fielding position of great value and a high degree of difficulty is often bestowed upon the team\'s lowliest member. \
                        With some exceptions, being stationed at short leg is usually an indicator of a player\'s hypothetical ranking rather than of their reflexes. </p>'},
            { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Harsha Bhogle on MS Dhoni's decision to give up captaincy."},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/tklpAM1gj8o" }
        ];

        var api = {
            "findAllWidgets" : findAllWidgets,
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget
        };
        return api;

        function findAllWidgets(pageId) {
            return widgets;
        }

        function deleteWidget(widgetId) {
            for(var w in widgets) {
                if(widgets[w]._id === widgetId) {
                    widgets.splice(w, 1);
                }
            }
        }

        function updateWidget(widgetId, newWidget){
            for(w in widgets){
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
            }
        }

        function findWidgetById(widgetId) {
            for(var w in widgets) {
                if(widgets[w]._id === widgetId) {
                    return angular.copy(widgets[w]);
                }
            }
            return null;
        }

        function findWidgetsByPageId(pageId) {
            var widgetsforPage = [];
            for(var w in widgets) {
                if(widgets[w].pageId === pageId) {
                    widgetsforPage.push(widgets[w]);
                }
            }
            return widgetsforPage;
        }

        function createWidget(pageId, widget) {
            widget.pageId = pageId;
            switch(widget.widgetType){
                case "HEADER":
                    widget.text = "Default Text";
                    widget.size = 3;
                    break;
                case "IMAGE":
                    widget.width = "100%";
                    widget.url = "http://lorempixel.com/";
                    break;
                case "YOUTUBE":
                    widget.width = "100%";
                    widget.url = "http://lorempixel.com/";
                    break;
                case "HTML":
                    widget.text = "Default Text";
                    break;
            }
            widgets.push(widget);
        }
    }
})();