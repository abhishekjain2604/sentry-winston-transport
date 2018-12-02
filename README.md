# Sentry Winston Transport

Winston transport for Sentry


## Install

```bash
$ npm install sentry-winston-transport
```

## Initialise

```javascript
const winston = require('winston');
const Sentry = require('sentry-winston-transport');

let logger = WINSTON.createLogger({
    transports: [
      new Sentry({
        dsn: '<sentry dsn>',
      })
    ]
  });
```

#### Full list of configuration options

```javascript
dsn                 // Required
release             // No default value
servername          // No default value
debug               // Default: true
environment         // Default: 'DEV'
sampleRate          // Default: 1.0
maxBreadcrumbs      // Default: 100
attachStacktrace    // Default: false
sendDefaultPii      // Default: true
```

For more information on configuration options, visit sentry's official documentation [here](https://docs.sentry.io/error-reporting/configuration/?platform=node)

#### Levels Mapping

Winston levels are mapped to the Sentry levels by:
```javascript
silly   :    'debug'
verbose :    'debug'
info    :    'info'
debug   :    'debug'
warn    :    'warning'
error   :    'error'
```

## Usage

```javascript
logger.log('info', 'My first log');
```


#### Log Errors

```javascript
try {
    someBuggyCode();
} catch (error) {
    logger.log('error', 'An error occured', { error });
}
```


#### Adding context

- **Tags**
    ```javascript
    let tags = {
      controller: 'getUsersList',
      fileName: 'controllers.js' 
    };
    logger.log('error', 'An error occured', { error, tags });
    ```
- **User**
    ```javascript
    let user = {
      id: '5b8b7f1acd12ca319a46a9e9',
      email: 'abc@example.com' 
    };
    logger.log('error', 'An error occured', { error, user });
    ```
- **Extra Data**
    ```javascript
    let extra = {
      timeStamp: new Data(),
      requestId: '5b8b8550cd12ca319a46aa0f'  
    };
    logger.log('error', 'An error occured', { error, ...extra });
    ```