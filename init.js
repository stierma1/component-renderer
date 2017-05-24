
var Server = require("./lib/server");
var logger = require("./lib/logger")

async function init(){
  //await load();
  //var T_Runner = new TransformerModule.Runner();
  //TransformerModule.globalRunner = T_Runner;
  logger.info("Initialization Start")
  var server = new Server();
  await server.start();
  logger.info("Initialization Complete")
}

try{
  init();
} catch(err){
  logger.error(err);
}
