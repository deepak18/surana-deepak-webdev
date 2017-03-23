var mongoose = require('mongoose');
var widgetSchema = require('./widget.schema.server');
var widgetModel = mongoose.model('WebAppWidget', widgetSchema);
var q = require('q');

var pageModel = require('../page/page.model.server');

widgetModel.createWidget = createWidget;
widgetModel.findAllWidgetsForPage = findAllWidgetsForPage;
widgetModel.findWidgetById = findWidgetById;
widgetModel.updateWidget = updateWidget;
widgetModel.deleteWidget = deleteWidget;
widgetModel.reorderWidget = reorderWidget;

module.exports = widgetModel;

function reorderWidget(pageId, index1, index2) {
    var deffered = q.defer();


    pageModel
        .findPageById(pageId)
        .then(function (page) {
             // console.log(page);

            for (var i = index1; i < index2; i++) {
                var temp = page.widgets[i];
                page.widgets[i] = page.widgets[i + 1];
                page.widgets[i + 1] = temp;
            }

            for (var i = index1; i > index2; i--) {
                var temp = page.widgets[i];
                page.widgets[i] = page.widgets[i - 1];
                page.widgets[i - 1] = temp;
            }
            // console.log(page);
            pageModel
                .update({_id: pageId}, {$set: {widgets: page.widgets}},
                    function(err, updatedPage) {
                        if(err){
                            deffered.reject(err);
                        } else{
                            deffered.resolve();
                        }

                    });
        });
    return deffered.promise;
}

function deleteWidget(widgetId) {
    var deffered = q.defer();

    widgetModel
        .findById(widgetId, function(err, widget){
            if(err){
                deffered.reject(err);
            } else{
                widget.remove();
                deffered.resolve();
            }
        });
    return deffered.promise;
}

function updateWidget(widgetId, updatedWidget) {
    var deffered = q.defer();

    widgetModel
        .update({_id:widgetId}, updatedWidget, function(err, widget) {
            if(err) {
                deffered.reject(err);
            }
            else{
                deffered.resolve(widget);
            }
        });
    return deffered.promise;
}

function findWidgetById(widgetId) {
    var deffered = q.defer();

    widgetModel
        .findById(widgetId, function(err, widget){
            if(err){
                deffered.reject(err);
            } else{
                deffered.resolve(widget);
            }
        });
    return deffered.promise;
}

function findAllWidgetsForPage(pageId) {
    var deffered = q.defer();


    pageModel
        .findById(pageId, function(err, page) {
            widgetModel
                .find({_id: {$in: page.widgets}}, function(err, widgets) {
                    if(err){
                        deffered.reject(err);
                    }
                    else{
                        widgets.sort(function(a, b) {
                            return page.widgets.indexOf(a._id) - page.widgets.indexOf(b._id);
                        });
                        deffered.resolve(widgets);
                    }
                });
        });


   /* widgetModel
        .find({_page: pageId}, function(err, widgets){
            if(err){
                deffered.reject(err);
            } else{
                deffered.resolve(widgets);
            }
        });*/
    return deffered.promise;
}

function createWidget(pageId, widget) {
    var deffered = q.defer();
    widget._page = pageId;

    widgetModel
        .create(widget, function (err, newWidget) {
            if(err){
                deffered.reject(err);
            } else{
                pageModel
                    .findPageById(pageId)
                    .then(function (page) {
                        page.widgets.push(newWidget._id);
                        page.save();
                    });

                deffered.resolve(newWidget);
            }
        });
    return deffered.promise;
}