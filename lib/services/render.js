
var varRegex = /\$\{([^\}]+?)\}/
var dustjs = require("dustjs-helpers");
var systemConfig = require("../../config");

class RenderService{
  constructor(){

  }

  render({renderTmpl, transformedData, params}){
    var {format, returnFormat, renderString} = renderTmpl;
    if(format === "string" || !format){
      return {format:returnFormat,  renderData:this.renderString(renderString, {params:params, data:transformedData.queries, env:systemConfig.environment})}
    }
    switch(format){
      case "dustjs":
      case "dust":
      case "dust.js": return {format:returnFormat,  renderData:this.renderDust(renderString, {params:params, data:transformedData.queries, env:systemConfig.environment})}
    }
  }

  renderString(renderStr, data){
    var rtRenderStr = renderStr

      var match = varRegex.exec(rtRenderStr);
      while(match){
        var d = pluck(match[1], data);
        rtRenderStr = rtRenderStr.replace(varRegex, d)
        match = varRegex.exec(rtRenderStr);
      }

    return rtRenderStr;
  }

  renderDust(renderStr, data){
    var compiled = dustjs.compile(renderStr);
    var tmpl = dustjs.loadSource(compiled);
    var outData = null
    var error = null;

    dustjs.render(tmpl, data, function(err, out) {
      outData = out;
      error = err;
    });

    if(error){
      throw error;
    }

    return outData;
  }
}



function pluck(str, data){
  var s = str.replace(/\]/, "").replace(/\[/, ".").split(".");
  var d = data;
  for(var i = 0; i < s.length; i++){
    if(d[s[i]]){
      d = d[s[i]];
    }
  }
  return d;
}

module.exports = RenderService;
