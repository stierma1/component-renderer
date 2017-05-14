var request = require("request");
var falcor = require("falcor");
var HttpDataSource = require("falcor-http-datasource");

var xmlParser = require("xml2js").parseString


class QueryService{
  constructor(){

  }

  launchQuery({id, queryType, format, query},queryOptions){

    if(queryType === "http" || queryType === "https"){
      return this.launchHttpQuery(id, query, format, queryOptions);
    } else if(queryType === "graphql"){
      var options = {json:{query:query}, method:"POST"};
      for(var i in queryOptions){
        options[i] = queryOptions[i];
      }
      return this.launchHttpQuery(id, query, format, options);
    } else if(queryType === "falcor"){
      return this.launchFalcorQuery(id, query, format, options)
    }
  }

  launchFalcorQuery(id, query, format, options){
    var model = new falcor.Model({
      source: new HttpDataSource(options.url)
    });

    return model.get.apply(model, query).then((data) => {
      return {id, result:data}
    });
  }

  launchHttpQuery(id, query, format, queryOptions){
    var options = {url:query, method:"GET"};
    for(var i in queryOptions){
      options[i] = queryOptions[i];
    }
    return new Promise((res, rej) => {
      request(options, (err, resp, body) =>{
        if(err){
          rej(err);
          return;
        }
        res({id, result:this.parseData(format, body)});

      });
    });
  }

  parseData(format, data){
    switch(format){
      case "string":
      case "text/hmtl":
      case "text": return data;
      case "json":
      case "application/json":
        if(typeof(data) === "string"){
          return JSON.parse(data);
        }
        return data;
      case "xml":
      case "application/xml":
        var outData = null;
        if(typeof(data) === "string"){
          xmlParser(data, function(err, out){
            outData = out;
          });
          return outData || data;
        }
        return data;
    }
    return data;
  }
}



module.exports = QueryService;
