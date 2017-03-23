var model = {};
model.userModel = require('./user/user.model.server');
model.websiteModel = require('./website/website.model.server');
model.pageModel = require('./page/page.model.server');
model.widgetModel = require('./widget/widget.model.server');
module.exports = model;