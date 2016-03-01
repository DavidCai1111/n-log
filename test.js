'use strict';
/* global describe, it, before, beforeEach */
require('should');
const log = require('./lib');

class TestStd {
  constructor() {
    this.buffer = '';
  }

  write(message) {
    this.buffer = message;
  }

  clean() {
    this.buffer = '';
  }
}

let testStdout = new TestStd();
let testStderr = new TestStd();
let _compose = log._compose;

describe('n-log', () => {
  before(() => {
    log._stdout = testStdout;
    log._stderr = testStderr;
    log._formatTime = () => '[_time]';
  });

  beforeEach(() => {
    log._compose = _compose;
    log.level = 0;
    testStdout.clean();
    testStderr.clean();
  });

  it('log should eql log.log', () => log.log.should.be.eql(log));

  it('should log the write info', () => {
    log.log('jaja');
    testStdout.buffer.should.be.containEql('[_time] jaja\n');

    let err = new Error('haha');
    err.code = 400;
    err.errno = 'errno';
    err.syscall = 'syscall';
    err.status = 'bad request';
    err.stack = 'some stack';
    err.otherKeys = 'otherKeys';
    log.error(err);
    testStderr.buffer.should.be.containEql('[_time] ERROR {"name":"Error","message":"haha"');

    let emptyError = {};
    log.error(emptyError);
    testStderr.buffer.should.be.containEql('[_time] ERROR {"name":"Error","message":"{}"}');
  });

  it('should log nothing when levels is too high', () => {
    log.level = 2;
    log.alert('jaja1');
    testStdout.buffer.should.be.eql('');

    log.level = 6;
    log.notice('jaja2');
    testStderr.buffer.should.be.eql('');
  });

  it('should use diy compose method', () => {
    log._compose = () => '123';
    log.info('jaja');
    testStdout.buffer.should.be.eql('123');
  });

  it('should use format when json stringify throw an error', () => {
    let obj = {};
    obj.__defineGetter__('foo', () => {
      throw new Error('ouch!');
    });

    log.info(obj);
    testStdout.buffer.should.be.containEql('[_time] INFO { foo: [Getter] }');
  });

  it('should use diy format time', () => {
    let _time = '';
    log._formatTime = time => {
      _time = time.toISOString();
      return `[${_time}]`;
    };

    log.info('jaja');
    testStdout.buffer.should.be.containEql(`[${_time}] INFO "jaja"`);
  });
});
