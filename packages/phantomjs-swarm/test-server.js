var TEST_RESPONDER_ROUTE = "/http_test_responder";

WebApp.connectHandlers.use("/google-title", function(req, res, next) {
  res.statusCode = 200;
  res.write("<html><head><title>Google</title></head><body></body></html>")
  res.end();
});
