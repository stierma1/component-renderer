
var TransformerModule = require("./transformer-runner");
var load = require("./transformer-loader");
var ComponentService = require("./services/component");
var QueryService = require("./services/query");
var RenderService = require("./services/render");
var transformerRunner = TransformerModule
var logger = require("./logger");

class ComponentRenderer{
  constructor(systemConfig){
    this.componentService = new ComponentService(systemConfig);
    this.queryService = new QueryService(systemConfig);
    this.renderService = new RenderService(systemConfig);
    this.transformerRunner = transformerRunner.globalRunner;
    this.systemConfig = systemConfig;
  }

  async init(){
    if(!TransformerModule.globalRunner){
      await load(this.systemConfig);

      var T_Runner = new TransformerModule.Runner();
      TransformerModule.globalRunner = T_Runner;
    }
    this.transformerRunner = TransformerModule.globalRunner
  }

  async render({componentId, queryParams}){
    var component = await this.componentService.getComponent(componentId);
    if(!component){
      res.status(404).send("No Component Named: " + componentId);
      return;
    }
    component.setParams(queryParams);
    await component.getQueries(this.queryService);
    await component.runTransform(this.transformerRunner);
    var {format, renderData} = await component.render(this.renderService);
    return {format, rendered:renderData};
  }

}

module.exports = ComponentRenderer;
