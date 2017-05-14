
var PouchDb = require("pouchdb");
var systemConfig = require("./config");
var fs = require("fs");
var path = require("path");

var filePath = path.join(process.cwd(), process.argv[3]);
var name = process.argv[2];
var file = JSON.parse(fs.readFileSync(filePath, "utf8"));

new PouchDb(systemConfig.pouchConfig.connectionString).put({
  _id:name,
  component:file
}).then(() => {
  console.log("Upload successful")
})
