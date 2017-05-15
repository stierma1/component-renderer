var uuid = require("uuid");
var logger = require("../logger");

class Component{
  constructor({name, renderTmpl, transform, queries}){
    this.instanceId = uuid.v4();
    this.name = name;
    this.renderTmpl = renderTmpl;
    this.transform = transform;
    this.queries = queries;
    this.params = null;
    this.resolvedQueries = {};
  }

  setParams(params){
    this.params = params;
  }

  async getQueries(queryService){
    var generatedQueries = [];

    for(var i in this.queries){
      var generatedQuery = this.generateQuery(i, this.queries[i]);
      generatedQueries.push(
        queryService.launchQuery(
          generatedQuery, this.queries[i].options
        )
      );
    }
    logger.debug("Waiting for Queries: %s, %s", this.name, this.instanceId)

    var s = (await Promise.all(generatedQueries)).map((resolvedQuery) => {
      this.resolvedQueries[resolvedQuery.id] = resolvedQuery.result;
    })

    logger.debug("Queries Resolved: %s, %s", this.name, this.instanceId)
  }

  async runTransform(transformerRunner){
    logger.debug("Running Transformation: %s, %s", this.name, this.instanceId)
    this.transformedData = await transformerRunner.run(this.transform || "NOOP",
      {component: this.name, instanceId: this.instanceId, params:this.params, queries:this.resolvedQueries}
    );
  }

  async render(renderService){
    logger.debug("Rendering Data: %s, %s", this.name, this.instanceId)
    return renderService.render({name:this.name, instanceId:this.instanceId, params:this.params, transformedData:this.transformedData, renderTmpl:this.renderTmpl});
  }

  generateQuery(id, params){
    var query = this.queries[id];
    if(!query){
      throw new Error("Query: " + id + " not found");
    }
    return {id: id, queryType: query.queryType, format:query.format, query: this._buildQuery(query, params)};
  }

  _buildQuery({queryTmpl}, params){
    var rtQueryTmpl = queryTmpl
    if(queryTmpl instanceof Array){
      return queryTmpl.map((q) => {
        return this._buildQuery({queryTmpl:q}, params);
      });
    }
    for(var i in params){
      var reg = new RegExp('\\$\\{' + i + "\\}");
      while(reg.test(rtQueryTmpl)){
        rtQueryTmpl = rtQueryTmpl.replace(reg, params[i]);
      }
    }
    return rtQueryTmpl;
  }


}

module.exports = Component;
