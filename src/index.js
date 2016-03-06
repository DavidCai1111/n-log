'use strict';
const {format} = require('util');

const LEVELS = [
  'EMERGENCY',
  'ALERT',
  'CRITICAL',
  'ERROR',
  'WARNING',
  'NOTICE',
  'INFO',
  'DEBUG'
];

function log(...messages) {
  log._stdout.write(log._compose({
    time: log._formatTime(new Date()),
    level: null,
    messages: format(...messages)
  }));
}

LEVELS.filter((name, level) => level < 5).forEach((name, level) => {
  log[name.toLowerCase()] = (...messages) => {
    if (level > log.level) return;

    log._stderr.write(log._compose({
      time: log._formatTime(new Date()),
      level: name,
      messages: format(...messages.map(log._errorify).map(log._stringify))
    }));
  };
});

LEVELS.filter((name, level) => level >= 5).forEach((name, level) => {
  level += 5;
  log[name.toLowerCase()] = (...messages) => {
    if (level > log.level) return;

    log._stdout.write(log._compose({
      time: log._formatTime(new Date()),
      level: name,
      messages: format(...messages.map(log._stringify))
    }));
  };
});

log.levels = LEVELS;
log.level = 7;
log._stdout = process.stdout;
log._stderr = process.stderr;

log._formatTime = time => {
  return `[${time.toISOString()}]`;
};

log._stringify = message => {
  try {
    return JSON.stringify(message);
  } catch (e) {
    return format(message);
  }
};

log._errorify = error => new _Error(error);

log._compose = ({time, level, messages}) => {
  let log = `${messages}\n`;
  if (level) log = `${level} ${log}`;
  if (time) log = `${time} ${log}`;
  return log;
};

function _Error(error) {
  this.name = error.name || 'Error';
  this.message = error.message || format(error);
  if (error.code) this.code = error.code;
  if (error.errno) this.errno = error.errno;
  if (error.syscall) this.syscall = error.syscall;
  if (error.status) this.status = error.status;

  Object.keys(error).forEach(key => {
    if (!this[key]) this[key] = error[key];
  });

  if (error.stack) this.stack = error.stack;

  return this;
}

log.log = log;
module.exports = log;
