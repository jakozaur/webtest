Package.describe({
  name: 'phantomjs-swarm',
  summary: 'Manage multiple PhantomJS instances securely',
  version: '0.0.1',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('http');
  api.use('mongo');
  api.use('underscore');
  api.addFiles('assets/phantomjs.js', 'server', {isAsset: true});
  api.addFiles('phantomjs-swarm.js', 'server');

  api.export('PhantomJsSwarm')
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('webapp', 'server');
  api.use('phantomjs-swarm');
  api.addFiles('test-server.js', 'server');
  api.export('bbbb');
  api.addFiles('phantomjs-swarm-tests.js', 'server');
});
