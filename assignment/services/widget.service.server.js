module.exports = function(app){
    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads'});

    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.post("/api/page/:pageId/widget", createWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    app.put("/page/:pageId/widget", reorderWidget);

    var widgetModel = require('../model/widget/widget.model.server');

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

    function uploadImage(req, res) {

        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var uid           = req.body.uid;
        var wid           = req.body.wid;
        console.log("width :  " +width);
    //    var originalname  = myFile.originalname; // file name on user's computer
    //    var filename      = myFile.filename;     // new file name in upload folder
    //    var path          = myFile.path;         // full path of uploaded file

    //    var size          = myFile.size;
    //    var mimetype      = myFile.mimetype;

        /*var imageWidget = widgets.find(function (widget) {
            return widget._id === widgetId;
        });*/
        if(req.file){
            var myFile        = req.file;
            var destination   = myFile.destination;  // folder where file is saved to

            widgetModel
                .findWidgetById(widgetId)
                .then(function (imageWidget) {
                    imageWidget.width = width;
                    imageWidget.url = req.protocol + '://' + req.get('host') + "/public/uploads/" +myFile.filename;
                    var pid = imageWidget._page;
                    imageWidget.save();
                    res.redirect("/assignment/index.html#/user/"+uid+"/website/"+wid+"/page/"+pid+"/widget");
                }, function (err) {
                    res.sendStatus(500).send(err);
                });
        }
        /*imageWidget.width = "100%";
        imageWidget.url = req.protocol + '://' + req.get('host') + "/public/uploads/" + myFile.filename;

        res.redirect("/assignment/index.html#/user/"+uid+"/website/"+wid+"/page/"+imageWidget.pageId+"/widget");*/
    }

    function deleteWidget(req, res) {
        var wgid = req.params.widgetId;

        widgetModel
            .deleteWidget(wgid)
            .then(function () {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for(var w in widgets) {
            if(widgets[w]._id === wgid) {
                widgets.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function createWidget(req, res) {
        var pid = req.params.pageId;
        var newWidget= req.body;

        switch(newWidget.type){
            case "HEADING":
                newWidget.text = "Default Text";
                newWidget.size = 3;
                break;
            case "IMAGE":
                newWidget.width = "100%";
                newWidget.url = "https://tinyurl.com/mlqjky2";
                break;
            case "YOUTUBE":
                newWidget.width = "100%";
                newWidget.url = "https://youtu.be/naJAbH-oWYc";
                break;
            case "HTML":
                newWidget.text = "Default Text";
                break;
        }

        widgetModel
            .createWidget(pid, newWidget)
            .then(function (widget) {
                res.json(widget);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function updateWidget(req, res) {
        var wgid = req.params.widgetId;
        var newWidget = req.body;

        for(w in widgets){
            widget = widgets[w];
            if(widget._id === wgid){
                switch(widget.type){
                    case "HEADING":
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

        widgetModel
            .updateWidget(wgid, newWidget)
            .then(function (updatedWidget) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
    }

    function findWidgetById(req, res) {
        var wgid = req.params.widgetId;

        widgetModel
            .findWidgetById(wgid)
            .then(function (widget) {
                res.json(widget);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*var widget = widgets.find(function (wg) {
            return wg._id === wgid;
        });
        res.json(widget);*/
    }

    function findAllWidgetsForPage(req, res) {
        var pid = req.params.pageId;

        widgetModel
            .findAllWidgetsForPage(pid)
            .then(function (widgets) {
                res.json(widgets);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*var widgetsforPage = [];
        for(var w in widgets) {
            if(widgets[w].pageId === pid) {
                widgetsforPage.push(widgets[w]);
            }
        }
        res.send(widgetsforPage);*/
    }

    function reorderWidget(req, res) {
        var pageId = req.params.pageId;
        var index1 = parseInt(req.query.initial);
        var index2 = parseInt(req.query.final);

        widgetModel
            .reorderWidget(pageId, index1, index2)
            .then(function() {
                res.sendStatus(200);
            }, function(err) {
                res.sendStatus(500).send(err);
            });
    }
};