module.exports = function(app){
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.post("/api/user", createUser);
    app.delete("/api/user/:userId", deleteUser);

    var userModel = require('./../model/user/user.model.server');

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder", email: "alice@gmail.com"},
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley", email: "bob@gmail.com"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia", email: "charly@gmail.com"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jannunzi@gmail.com"}
    ];

    function deleteUser(req, res) {
        var userId = req.params.userId;

        userModel
            .deleteUser(userId)
            .then(function() {
                res.sendStatus(200);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for(var u in users){
            if(users[u]._id === userId){
                users.splice(u, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function createUser(req, res) {
        var newUser = req.body;

        userModel
            .createUser(newUser)
            .then(function (newUser) {
                res.json(newUser);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*newUser._id =(new Date()).getTime().toString();
        users.push(newUser);
        res.send(newUser._id);*/
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;

        userModel
            .updateUser(userId, newUser)
            .then(function (user) {
                res.send(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        /*for(var u in users) {
            var user = users[u];
            if( user._id === userId ) {
                users[u].firstName = newUser.firstName;
                users[u].lastName = newUser.lastName;
                users[u].email = newUser.email;
                //  res.json(users[u]);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);*/
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        //  console.log(userId);
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(500).send(err);
            });
        
        /*
        var user = users.find(function(u){
            return u._id === userId;
        });
        
        res.json(user);*/
    }

    function findUser(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        if(username && password){
            findUserByCredentials(req, res);
        } else if(username){
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query['username'];

        userModel
            .findUserByUsername(username)
            .then(function (user) {
                if(!(user == undefined)){
                    res.json(user);
                }
                else{
                    res.sendStatus(500);
                }
            }, function (err) {
                res.sendStatus(500).send(err);
            });

        /*var user = users.find(function (u) {
            return u.username == req.query['username'];
        });

        if(user){
            res.json(user);
        } else{
            res.sendStatus(404);
        }*/
    }
    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        userModel
            .findUserByCredentials(username, password)
            .then(function(user){
                res.json(user);
            }, function (err){
                res.sendStatus(500).send(err);
            });
        /*var user = users.find(function(user){
            return user.password == password && user.username == username;
        });

        if(user){
            res.json(user);
        } else{
            res.sendStatus(404);
        }*/
    }
};