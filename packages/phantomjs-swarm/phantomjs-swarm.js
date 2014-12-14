var shell = Npm.require('child_process');
var fs = Npm.require('fs')

// We keep them to trac who use them
var PhantomJsServers = new Mongo.Collection('phantomjs_collection');

PhantomJsSwarm = function (options) {
  var self = this;
  if (! (self instanceof PhantomJsSwarm))
    throw new Error("use 'new' to construct a PhantomJsSwarm");

  options = options || {};
  self.defaultTimeoutMs = options.defaultTimeoutMs || 10000;
  self._tmpPhantomJsPath = options.tmpPhantomJsPath || '/tmp/phantomjs-temp.js';
  self.phantomJsPath = options.phantomJsPath || 'phantomjs';
  self._swarmName = options._swarmName || "default";
  self.threadCount = options.threadCount || 10;
  self.initialPort = options.initialPort || 4100;

  // create server phantomjs path
  var err = fs.writeFileSync(self._tmpPhantomJsPath,
    new Buffer(Assets.getBinary('assets/phantomjs.js')));

  if (err)
    throw new Error("Can't write server phantomjs file");

  // Create Mongo lock
  console.log("Creating Mongo objects");
  PhantomJsServers.remove({swarmName: self._swarmName});
  for (var i = 0; i < self.threadCount; ++i) {
    PhantomJsServers.insert({
      swarmName: self._swarmName,
      swarmId: i,
      port: self.initialPort + i,
      usedBy: ""
    });
  }
}

_.extend(PhantomJsSwarm.prototype, {
  run: function(func, args, callback) {
    var self = this;
    var runId = Random.id();
    PhantomJsServers.update({usedBy: ""}, {$set: {usedBy: runId}});
    // TODO: check if right
    var server = PhantomJsServers.findOne({usedBy: runId});

    console.log("PhantomJs.run(): Launching new PhantomJs on port", server.port);

    var cmd = shell.spawn(self.phantomJsPath,
      [self._tmpPhantomJsPath, server.port]);

    // debug, later we will send it to logs
    cmd.stderr.on('data', function (data) {
      console.log("PhantomJS STDERR:", data.toString());
    });

    cmd.stdout.on('data', Meteor.bindEnvironment(function (data) {
      console.log("PhantomJS STDOUT:", data.toString());
      data = String(data).trim();
      if (data.substr(-5) === 'Ready'){
        console.log("PhantomJs.run(): PhantomJs is ready, sending request");

        var request = JSON.stringify({
          func: func.toString(),
          args: args
        });

        try {
          HTTP.post('http://localhost:' + server.port + '/', {
            headers: {'Content-Length': request.length},
            content: request,
            timeout: self.defaultTimeoutMs
          }, function (error, result) {
            console.log(error);
            console.log("PhantomJs.run(): got response", error, "result", result);
            cmd.kill();
            cmd.kill('SIGKILL');
            PhantomJsServers.update({usedBy: runId}, {$set: {usedBy: ""}});
            if (error) {
              if (error.code == 'ETIMEDOUT' || error.code == 'ESOCKETTIMEDOUT') {
                callback({code: 408, reason: 'The code has timed out'}, null);
              } else {
                callback(JSON.parse(error.response.content), null)
              }
            } else {
              callback(null, JSON.parse(result.content));
            }
          });
        } catch (e) {
          console.log("Error while HTTP POST")
          cmd.kill();
          cmd.kill('SIGKILL');
          PhantomJsServers.update({usedBy: runId}, {$set: {usedBy: ""}});
          callback(e);
        }
      };
    }));

  }
});
