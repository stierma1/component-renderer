var express = require("express");
var path = require("path");
var systemConfig = require("../config.js");
var ComponentService = require("./services/component");
var QueryService = require("./services/query");
var RenderService = require("./services/render");
var transformerRunner = require("./transformer-runner");
var logger = require("./logger");

class Server{
  constructor(){
    this.componentService = new ComponentService();
    this.queryService = new QueryService();
    this.renderService = new RenderService();
    this.transformerRunner = transformerRunner.globalRunner;
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
      var component = await this.componentService.getComponent(req.params.componentId);
      if(!component){
        res.status(404).send("No Component Named: " + req.params.componentId);
        return;
      }
      component.setParams(req.query);
      await component.getQueries(this.queryService);
      await component.runTransform(this.transformerRunner);
      var {format, renderData} = await component.render(this.renderService);
      res.set("Content-Type", format).status(200).send(renderData);
    });
    this.app.listen(systemConfig.server.port, systemConfig.server.hostName);
    logger.info("Server Open on port " + systemConfig.server.port )
  }
}

module.exports = Server;
