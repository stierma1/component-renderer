var PouchDb = require("pouchdb");
var Component = require("../contracts/component");

class ComponentService{
  constructor(config){

    this.pouchConfig = config.pouchConfig;
    this.pouchDd = PouchDb;
    this.pouchDbInstance = null;
    this.systemConfig = config;
  }

  _init(){
    if(this.pouchDbInstance){
      return;
    }
    this.pouchDbInstance = new this.pouchDd(this.pouchConfig.connectionString);
  }

  getComponent(id){
    this._init();
    return this.pouchDbInstance.get(id).then((doc) => {
      return new Component(doc.component);
    }).catch((err) => {
      if(err.status === 404){
        return Promise.resolve(null);
      }
      return Promise.reject(err)
    })
  }

}

module.exports = ComponentService;
