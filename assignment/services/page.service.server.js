module.exports = function(app){
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.post("/api/website/:websiteId/page", createPage);
    app.delete("/api/page/:pageId", deletePage);

    var pageModel = require('../model/page/page.model.server');

    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
        { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
    ];

    function deletePage(req, res) {
        var pid = req.params.pageId;

        pageModel
            .deletePage(pid)
            .then(function () {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for(var p in pages) {
            if(pages[p]._id === pid) {
                pages.splice(p, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function createPage(req, res) {
        var wid = req.params.websiteId;
        var newPage = req.body;

        pageModel
            .createPage(wid, newPage)
            .then(function (page) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });

        /*newPage.websiteId = wid;
        newPage._id = (new Date()).getTime().toString();
        newPage.description = newPage.title;
        pages.push(newPage);
        res.sendStatus(200);*/
    }

    function updatePage(req, res) {
        var pid = req.params.pageId;
        var newPage = req.body;

        pageModel
            .updatePage(pid, newPage)
            .then(function (updatedPage) {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for (p in pages) {
            page = pages[p];
            if (page._id === pid) {
                page.name = newPage.name;
                page.description = newPage.description;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function findPageById(req, res) {
        var pid = req.params.pageId;

        pageModel
            .findPageById(pid)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*var page = pages.find(function(p){
           return p._id === pid;
        });

        res.json(page);*/
    }

    function findAllPagesForWebsite(req, res) {
        var wid = req.params.websiteId;

        pageModel
            .findAllPagesForWebsite(wid)
            .then(function (pages) {
                res.json(pages);
            }, function(err) {
                res.sendStatus(500).send(err);
            });

        /*var pagesforWebsite = [];
        for(var p in pages) {
            if(pages[p].websiteId === wid) {
                pagesforWebsite.push(pages[p]);
            }
        }
        res.send(pagesforWebsite);*/
    }
};