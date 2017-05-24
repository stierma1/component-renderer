var express = require("express");
var path = require("path");
var systemConfig = require("../config.js");
var ComponentRenderer = require("./component-renderer");
var logger = require("./logger");

class Server{
  constructor(){
    this.componentRenderer = new ComponentRenderer(systemConfig);
    this.app = express();
  }

  start(){
    this.app.use(express.static(systemConfig.static || path.join(__dirname, "..", "static")));
    this.app.get("/components/:componentId", function(req, res, next){
      var t = Date.now();
      req.once("end", function(){
        logger.info("Request Completed, Component: %s, Status: %s, Time: %s", req.params.componentId, res.statusCode, (Date.now() - t)/1000 );
      });
      next();
    },  async (req, res) => {
      await this.componentRenderer.init();
      var {format, rendered} = await this.componentRenderer.render({componentId:req.params.componentId, queryParams:req.query});
      res.set("Content-Type", format).status(200).send(rendered);
    });
    this.app.listen(systemConfig.server.port, systemConfig.server.hostName);
    logger.info("Server Open on port " + systemConfig.server.port )
  }
}

module.exports = Server;
