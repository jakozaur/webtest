var system = require('system');
var port = system.args[1];

if (!port) {
  console.log('Must specify port as first argument.');
  phantom.exit(1);
};

var webserver = require('webserver');
var server = webserver.create();

console.log('PhantomJS server starting on port', port);

var service = server.listen(port, {
  keepAlive: true
}, function(request, response) {
  console.log("Phantom: Got request!")

  if (request.post) {
    console.log("Phantom: POST request");
    var packetData = JSON.parse(request.post);
    var func = eval('(' + packetData.func + ')');
    var args = packetData.args;
    console.log("Phantom: POST request 2");


    var funcCallback = function(error, result){
      var output;
      if (error) {
        response.statusCode = 501;
        output = {error: 501, reason: error};
      } else {
        response.statusCode = 200;
        output = result;
      }
      var outputString = JSON.stringify(output || null);
      response.setHeader('Content-Length', outputString.length);
      response.write(outputString);
      response.close();
    }
    args.push(funcCallback);
    try {
      func.apply(this, args);
    } catch(err) {
      response.statusCode = 400;
      var output = {error: 400, reason: err.toString()};
      var outputString = JSON.stringify(output);
      response.setHeader('Content-Length', outputString.length);
      response.write(outputString);
      response.close();
    };
  } else {
    response.statusCode = 405;
    var error = {error: 405, reason: 'post-required', req: request};
    var errorString = JSON.stringify(error);
    response.setHeader('Content-Length', errorString.length);
    response.write(errorString);
    response.close();
  };
});

console.log("Ready");
