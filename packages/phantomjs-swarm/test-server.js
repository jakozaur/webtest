var TEST_RESPONDER_ROUTE = "/http_test_responder";

var respond = function(req, res) {
  res.statusCode = 200;
  res.write("<html><head><title>Google</title></head><body></body></html>")
  res.end();
};

/*
WebApp.connectHandlers.use(TEST_RESPONDER_ROUTE, function(req, res, next) {
  res.writeHead(200);
  res.end("Hello world from: " + Meteor.release);
});
*/

var run_responder = function() {
  WebApp.connectHandlers.stack.unshift(
    { route: TEST_RESPONDER_ROUTE, handle: respond });
};

run_responder();
