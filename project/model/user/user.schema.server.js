var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String},
    firstName: String,
    lastName:String,
    email: String,
    phone: String,
    google: {
        id: String,
        token: String
    },
    spotify: {
        id: String,
        token: String
    },
    role: {type:String, default: "LEARNER", enum:['ADMIN', 'LEARNER', 'TUTOR']},
    slides: [String],
    videos: [String],
    uploads: [String],
    dateCreated: {type:Date, default: Date.now()}
}, {collection:'musical.tutorial.user'});


module.exports = userSchema;
/*

userSchema.post('remove', function () {
    var user = this;
    var websiteModel = require('../website/website.model.server');
    var pageModel = require('../page/page.model.server');
    var widgetModel = require('../widget/widget.model.server');
    pageModel.find({_website: {$in: user.websites}}, '_id', function (err, pages) {
        if(err == null) {
        //    widgetModel.remove({_page: {$in: pages}}).exec();
            pageModel.remove({_id: {$in: pages}}).exec();
        }
    });
    websiteModel.remove({_id: {$in: user.websites}}).exec();
});*/
