/**
 * Created by Deepak on 4/1/2017.
 */
module.exports = function(app){

    require("./services/user.service.server")(app);
    require("./services/slide.service.server")(app);
    require("./services/video.service.server")(app);
   /* require("./services/website.service.server")(app);
    require("./services/page.service.server")(app);
    require("./services/widget.service.server")(app);*/
};