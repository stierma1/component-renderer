
var TransformerModule = require("./lib/transformer-runner");
var load = require("./lib/transformer-loader");
var Server = require("./lib/server");
var PouchDb = require("pouchdb");
var logger = require("./lib/logger")

async function init(){
  await load();
  var T_Runner = new TransformerModule.Runner();
  TransformerModule.globalRunner = T_Runner;
  var server = new Server();
  await server.start();
  logger.info("Initialization Complete")
}

try{
  init();
} catch(err){
  logger.error(err);
}
