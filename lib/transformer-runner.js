
var System = require("pid-system");
var uuid = require("uuid");

module.exports._handler = async function(){
  var [returnPid, corrId, name, message] = await this.receive();
  var pid = await System.resolve(name);

  if(!pid){
    returnPid.send(["return", corrId, "ERR", new Error("NO TRANSFORMATION NAMED: " + name)])
    this.exit();
    return;
  }

  pid.send([this, message]);
  var [status, mess] = await this.receive();
  returnPid.send(["return", corrId, status, mess]);
  this.exit();
}

 async function runner(){
  var [action, ...rest] = await this.receive();

  if(action === "run"){
    let [correId, name, message] = rest;
    var handlerPid = await System.spawn(__dirname + "/transformer-runner.js", "_handler");
    handlerPid.send([this, correId, name, message]);
  } else if(action === "return"){
    let [corrId, status, mess] = rest;
    this.emit(corrId, [status, mess]);
  }

  this.recurse(runner);
}

module.exports._runner = runner

class Runner{
  constructor(){
    this._runnerPid = null;
    this.ready = false;
    this.wait = System.spawn(__dirname + "/transformer-runner.js", "_runner").then((pid) => {
      this._runnerPid = pid;
      this.ready = true;
    }).catch((err) => {
      console.log(err);
    })
  }

  async run(name, message){
    if(name === "NOOP"){
      return message;
    }
    if(this.ready){
      return new Promise((res, rej) => {
        var corrId = uuid.v4();
        this._runnerPid.once(corrId, ([status, mess]) => {

          if(status === "ERR"){
            rej(mess);
            return;
          }
          res(mess);
        });

        this._runnerPid.send(["run", corrId, name, message]);
      });

    } else {
      return this.wait.then(() => {
        return this.run(name, message);
      });
    }
  }
}

module.exports.Runner = Runner;
module.exports.globalRunner = null;
