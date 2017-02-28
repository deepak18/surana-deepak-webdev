module.exports = function(app){
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.post("/api/user/:userId/website", createWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem", "created": new Date()},
        { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem", "created": new Date()},
        { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem", "created": new Date()},
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem", "created": new Date()},
        { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem", "created": new Date()},
        { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem", "created": new Date()}
    ];

    function deleteWebsite(req, res) {
        var wid = req.params.websiteId;

        for(var w in websites) {
            if(websites[w]._id === wid) {
                websites.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function createWebsite(req, res) {
        var newWebsite = req.body;

        newWebsite._id = (new Date()).getTime().toString();
        newWebsite.developerId = req.params.userId;
        newWebsite.created = new Date();

        websites.push(newWebsite);
        res.sendStatus(200);
    }

    function updateWebsite(req, res) {
        var wid = req.params.websiteId;
        var newWebsite = req.body;
        for(var w in websites) {
            var website = websites[w];
            if(website._id === wid){
                website.name = newWebsite.name;
                website.description = newWebsite.description;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function findWebsiteById(req, res) {
        var wid = req.params['websiteId'];

        var website = websites.find(function(w){
            return w._id === wid;
        });
        res.json(website);
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;

        var sites = [];
        for(var w in websites) {
            if(websites[w].developerId === userId) {
                sites.push(websites[w]);
            }
        }
        res.send(sites);
    }
};