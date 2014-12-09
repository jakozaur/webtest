var shell = Npm.require('child_process');
var fs = Npm.require('fs')

// We keep them to trac who use them
var PhantomJsServers = new Mongo.Collection('phantomjs_collection');

PhantomJs = {
  initialize: function() {

  },

  // Run PhantomJs code
  // - func: JavaSctipt function
  // - args: passed to function
  // - callback: called at the end with (error, result)
  run: function(func, args, callback) {
    var cmd, port = 4005;
    // TODO: Get port

    console.log("PhantomJs.run(): Launching new PhantomJs");
    var ret = fs.writeFileSync('/tmp/phantomjs-temp.js',
      new Buffer(Assets.getBinary('assets/phantomjs.js')));

    cmd = shell.spawn('phantomjs', ['/tmp/phantomjs-temp.js', port]);

    //cmd = shell.spawn('phantomjs', [])

    // debug, later we will send it to logs
    cmd.stderr.pipe(process.stderr);
    cmd.stderr.pipe(process.stdout);

    cmd.stdout.on('data', Meteor.bindEnvironment(function (data) {
      console.log(data.toString());
      data = String(data).trim();
      if(data.substr(-5) === 'Ready'){
        console.log("PhantomJs.run(): PhantomJs is ready, sending request");

        var request = JSON.stringify({
          func: func.toString(),
          args: args
        });

        try {
          HTTP.post('http://localhost:' + port + '/', {
            headers: {'Content-Length': request.length},
            content: request
          }, function (error, result) {
            console.log(error);
            console.log("PhantomJs.run(): got response", error, "result", result);
            cmd.kill();
            if (error) {
              callback(JSON.parse(error.response.content), null)
            } else {
              callback(null, JSON.parse(result.content));
            }
            // TODO: return port
          });
        } catch (e) {
          console.log("Error while HTTP POST")
          // TODO: return port
          cmd.kill();
          callback(e);
        }
      };
    }));



  }
};
