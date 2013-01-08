'use strict';

/**
 * Benchmark dependencies.
 */
var microtime = require('microtime')
  , benchmark = require('benchmark')
  , yaml = require('yamlparser')
  , path = require('path')
  , fs = require('fs');

/**
 * Useragent parsers.
 */
var useragent2 = require('../')
  , useragent = require('useragent')
  , uaparser = require('ua-parser')
  , useragent_parser = require('useragent_parser')
  , useragent_parser2 = require('useragent-parser');

/**
 * Setup the test-files.
 */
var useragentlist = path.join(__dirname, '..', 'tests', 'fixtures', 'testcases.yaml')
  , yammy = yaml.eval(fs.readFileSync(useragentlist).toString()).test_cases
  , testcases = yammy.map(function (test) {
      return test.user_agent_string;
    })
  , length = testcases.length;

/**
 * Setup the benchmark
 */
var froomfroom = new benchmark.Suite;

froomfroom
.add('useragent latest', function () {
  for (var i = 0; i < length; i++ ) {
    useragent2.parse(testcases[i]);
  }
})
.add('useragent1', function () {
  for (var i = 0; i < length; i++ ) {
    useragent.parser(testcases[i]);
  }
})
.add('useragent_parser', function () {
  for (var i = 0; i < length; i++ ) {
    useragent_parser.parse(testcases[i]);
  }
})
.add('useragent-parser', function (){
  for (var i = 0; i < length; i++ ) {
    useragent_parser2.parse(testcases[i]);
  }
})
.add('ua-parser', function () {
  for (var i = 0; i < length; i++ ) {
    uaparser.parse(testcases[i]);
  }
})
.on('cycle', function (event) {
  var details = event.target;

  console.log('Executed benchmark (%s)', details.name);
  console.log('Count (%d), Cycles (%d), Elapsed (%d), Hz (%d)\n'
   , details.count
   , details.cycles
   , details.times.elapsed
   , details.hz
  );
})
.on('complete', function () {
  console.log(this.filter('fastest').pluck('name') + ' has/have the fastest parser');
});

/**
 * Start the benchmark, froom frooom!!
 */
console.log('Starting the benchmark, parsing ' + length + ' useragent strings per run');
froomfroom.run();
