Router.route('/', function () {
  GAnalytics.pageview();
  this.render('main');
});

Router.route('/:_id', function () {
  // add the subscription handle to our waitlist
  this.wait(Meteor.subscribe('fiddle', this.params._id));

  // this.ready() is true if all items in the wait list are ready

  if (this.ready()) {
    GAnalytics.pageview();
    var fiddle = Fiddle.findOne(this.params._id);
    Session.set('phantomCode', fiddle.code);
    Session.set('logs', fiddle.logs);
    Session.set('screenshoots', fiddle.screenshoots);
    Session.set('screenshootSelected', fiddle.screenshootSelected);
    this.render('main');
  } else {
    if (!Session.get('showSharePopup')) {
      Session.set('screenshoots', [{
        name: "Wait",
        url: "Loading...",
        image: WaitingScreenshoot
      }]);
      Session.set('screenshootSelected', 0);
      Session.set('phantomCode', '');
      Session.set('logs', []);
    }
    this.render('main');
  }
});
