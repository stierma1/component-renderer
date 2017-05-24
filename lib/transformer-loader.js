
var System = require("pid-system");
var glob = require("glob");
var path = require("path");
var testRegex = /\.test|\.spec|\.Spec/

async function load(systemConfig){
  try{
    var pidFiles = glob.sync(
      (systemConfig.transformerDirectory && path.join(systemConfig.transformerDirectory, "*")) ||
      path.join(__dirname, "../pids/*"));
  } catch(err){
    console.log(err);
    pidFiles = [];
  }
  for(var i = 0; i < pidFiles.length; i++){
    var nameSpl = pidFiles[i].split("/");
    var name = nameSpl[nameSpl.length-1].replace(".js", "");
    if(testRegex.test(name)){
      continue;
    }
    var pid = await System.spawn(pidFiles[i], null);
    System.register(name, pid);
  }

}


module.exports = load;
