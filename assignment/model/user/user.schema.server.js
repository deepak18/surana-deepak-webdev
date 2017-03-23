var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName:String,
    email: String,
    phone: String,
    websites: [{type: mongoose.Schema.Types.ObjectId, ref: 'WebAppWebsite'}],
    dateCreated: {type:Date, default: Date.now()}
}, {collection:'webapp.user'});


module.exports = userSchema;

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
});