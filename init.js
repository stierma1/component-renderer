
var TransformerModule = require("./lib/transformer-runner");
var load = require("./lib/transformer-loader");
var Server = require("./lib/server");
var PouchDb = require("pouchdb");

async function init(){
  await load();
  var T_Runner = new TransformerModule.Runner();
  TransformerModule.globalRunner = T_Runner;
  var server = new Server();
  await server.start();
  console.log("Server Up");
}

try{
  init();
} catch(err){
  console.log(err)
}
