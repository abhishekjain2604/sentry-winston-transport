const Transport = require('winston-transport');
const Sentry = require('@sentry/node');

class SentryTransport extends Transport {
  constructor(opts) {

    if (Object.prototype.toString.call(opts) != {}.toString())
      throw new Error('Error in initialising sentry transport. Was expecting an object.');

    if (!opts.dsn)
      throw new Error('DSN is required');

    super(opts);

    // 'dsn', 'release' and 'servername' don't carry any default values but can be set
    this.config = {
      debug: true,
      environment: 'DEV',
      sampleRate: 1.0,
      maxBreadcrumbs: 100,
      attachStacktrace: false,
      sendDefaultPii: true,
    }
    this.levelsMap = {
      silly: 'debug',
      verbose: 'debug',
      info: 'info',
      debug: 'debug',
      warn: 'warning',
      error: 'error'
    };

    for (let key in opts)
      this.config[key] = opts[key];

    Sentry.init(this.config);
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    let { level, message, error, tags, user, ...extra } = info;
    level = this.levelsMap[level];

    if (Object.prototype.toString.call(user) != {}.toString()) {
      extra.user = user;
      user = null;
    }

    Sentry.withScope((scope) => {
      try {

        if (tags) {
          for (let key in tags) scope.setTag(key, tags[key]);
        }

        scope.setLevel(level);

        if (user) scope.setUser(user);

        for (let key in extra) scope.setExtra(key, extra[key]);
        if (level == 'error' && message) scope.setExtra('customMessage', message);


        if (level == 'error') {
          if (!error || !(error instanceof Error))
            throw new Error('Error object is required');
          Sentry.captureException(error);
        }
        else if (message) {
          Sentry.captureMessage(message);
        }
        else {
          throw new Error('Message is required');
        }

        callback();
      }
      catch (error) {
        console.error(error);
      }
    });
  }
};

module.exports = SentryTransport;