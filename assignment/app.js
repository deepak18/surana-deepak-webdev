module.exports = function(app){
    require("./model/models.server");
    //var userModel = require("./model/user/user.model.server");
    //var websiteModel = require("./model/website/website.model.server");
    require("./services/user.service.server")(app);
    require("./services/website.service.server")(app);
    require("./services/page.service.server")(app);
    require("./services/widget.service.server")(app);
};