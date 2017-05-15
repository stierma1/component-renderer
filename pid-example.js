
async function example(){
  var [pid, message] = await this.receive();

  pid.send(["OK", message]);
}

/*
  MSG Format
  { component: 'name',
  instanceId: 'c0917811-f8a1-48e1-88ae-5cb50822ec78',
  params: { hello: 'bacon1' },
  queries:
   { test:
      { args: {},
        headers: [Object],
        origin: '63.231.159.158',
        url: 'https://httpbin.org/get' } } }
*/

//Render input Example
/*
{
{ params: { hello: 'bacon1' },
data:
 { test:
    { args: {},
      headers: [Object],
      origin: '63.231.159.158',
      url: 'https://httpbin.org/get' } },
env: undefined }
}*/

module.exports = example
