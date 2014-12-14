var shell = Npm.require('child_process');
var fs = Npm.require('fs')

// We keep them to trac who use them
var PhantomJsServers = new Mongo.Collection('phantomjs_collection');

PhantomJsSwarm = function (options) {
  var self = this;
  if (! (self instanceof PhantomJsSwarm))
    throw new Error("use 'new' to construct a PhantomJsSwarm");

  options = _.extend({
    defaultTimeoutMs: 10000,
    tmpPhantomJsPath: '/tmp/phantomjs-temp.js',
    phantomJsPath: 'phantomjs',
    swarmName: 'default',
    threadCount: 10,
    initialPort: 4100,
    debugLogs: false
  }, options || {});

  var log;
  if (options.debugLogs) {
    log = console.log;
  } else {
    log = function () {};
  }

  // create server phantomjs path
  var err = fs.writeFileSync(options.tmpPhantomJsPath,
    new Buffer(Assets.getBinary('assets/phantomjs.js')));

  if (err)
    throw new Error("Can't write server phantomjs file");

  // Create MongoDB based locks
  log("Creating Mongo objects");
  PhantomJsServers.remove({swarmName: options.swarmName});
  for (var i = 0; i < options.threadCount; ++i) {
    PhantomJsServers.insert({
      swarmName: options.swarmName,
      swarmId: i,
      port: options.initialPort + i,
      usedBy: ""
    });
  }

  self.run = function(func, args, callback) {
    var self = this;
    var runId = Random.id();
    var foundPort = PhantomJsServers.update({usedBy: ""},
      {$set: {usedBy: runId}});
    if (foundPort == 0) { // handle case if we hit maximum number of threads
      callback({"code":503,"reason":"Too many PhantomJS running."}, null);
      return;
    }
    var server = PhantomJsServers.findOne({usedBy: runId});

    log("PhantomJs.run(): Launching new PhantomJs on port", server.port);

    var cmd = shell.spawn(options.phantomJsPath,
      [options.tmpPhantomJsPath, server.port]);

    // debug, later we will send it to logs
    cmd.stderr.on('data', function (data) {
      log("PhantomJS STDERR:", data.toString());
    });

    cmd.stdout.on('data', Meteor.bindEnvironment(function (data) {
      log("PhantomJS STDOUT:", data.toString());
      data = String(data).trim();
      if (data.substr(-5) === 'Ready'){
        log("PhantomJs.run(): PhantomJs is ready, sending request");

        var request = JSON.stringify({
          func: func.toString(),
          args: args
        });

        try {
          HTTP.post('http://localhost:' + server.port + '/', {
            headers: {'Content-Length': request.length},
            content: request,
            timeout: options.defaultTimeoutMs
          }, function (error, result) {
            log(error);
            log("PhantomJs.run(): got response", error, "result", result);
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
          log("Error while HTTP POST")
          cmd.kill();
          cmd.kill('SIGKILL');
          PhantomJsServers.update({usedBy: runId}, {$set: {usedBy: ""}});
          callback(e);
        }
      };
    }));

  }
};
