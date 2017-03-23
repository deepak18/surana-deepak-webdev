module.exports = function (app) {
    app.post('/api/movie', createMovie);

    var mongoose = require('mongoose');

    var MovieSchema = mongoose.Schema({
        title: String,
        director: String,
        rating: String,
        created: Date
    }, {collection: 'movie'});

    var MovieModel = mongoose.model('MovieModel' , MovieSchema);

    function createMovie(req, res) {
        var movie = req.body;
        MovieModel
            .create(movie)
            .then(
                function (movie) {
                    res.json(movie);
                },
                function () {
                    res.sendStatus(400).send(error);
                }
            )
    }

    // MovieModel.create({title: 'Terminator'});

    var promise = MovieModel.find();
    promise.then(
        function (movies) {
          //  console.log(movies);
        },
        function (error) {

        }
    )

};