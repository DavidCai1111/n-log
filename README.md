# n-log

[![Build Status](https://travis-ci.org/DavidCai1993/n-log.svg?branch=master)](https://travis-ci.org/DavidCai1993/n-log)
[![Coverage Status](https://coveralls.io/repos/github/DavidCai1993/n-log/badge.svg?branch=master)](https://coveralls.io/github/DavidCai1993/n-log?branch=master)

Logging with happiness

## Installation

```
npm install n-log
```

## Example

```js
'use strict';
const log = require('n-log');

log.debug('bala');
// [2016-03-01T06:34:19.689Z] DEBUG "bala"
log.info('balabala');
// [2016-03-01T06:34:19.692Z] INFO "balabala"
log.error(new Error('bala'));
// [2016-03-01T06:34:19.692Z] ERROR {"name":"Error","message":"bala","stack":"Error: bala\n at Object.<anonymous>...}
```

## LEVELS

- 0 EMERGENCY
- 1 ALERT
- 2 CRITICAL
- 3 ERROR
- 4 WARNING
- 5 NOTICE
- 6 INFO
- 7 DEBUG

## API

### log(...message) [no level]

### log.log(...message) [no level]

### log.emergency(...message) [level 0]

### log.alert(...message) [level 1]

### log.critical(...message) [level 2]

### log.error(...message) [level 3]

### log.warning(...message) [level 4]

### log.notice(...message) [level 5]

### log.info(...message) [level 6]

### log.debug(...message) [level 7]

### log._stdout

Set the stdout, by default it is `process.stdout`.

### log._stderr

Set the stderr, by default it is `process.stderr`.

### log.level

Set the log level, all logs whose level are higher than this will be ignored, by default it is `7`.

### log._compose({time, level, messages})

  - time: The time object, formatted by `log._formatTime`.
  - level: The level of this log, if it's a no level log, it will be `null`.
  - message: Content of the log, formatted by `log._stringify`.

Compose the output, by default it is `[time] level message`.

### log._formatTime(time)
  - time: The time object, created by `new Date()`.

Format the time which will be passed to `log._compose`, by default it is `[time.toISOString()]`

### log._stringify(message)
 - message: The argument passed to the log methods.

The method to stringify the message. If the log methods is called with not a single argument, this method will be call lots of times.

### log._errorify(error)
 - error: the object passed to the log method whose level is lower than 4.

The method to stringify the error, when it is passed to the log method whose level is lower than 4, before the it is passed to `log._stringify` method, it will be errorify by this method first. If the log methods is called with not a single argument, this method will be call lots of times.
