'use strict';

var tape = require('tape');
// var Hoek = require('hoek');
var init = require('../example/server.js').init;
var tagsPool = require('../example/server.js').tagsPool;
var tags = require('../example/tags.json');
var server;

// set up server
tape('set up server', function (t) {
  init(2000, function (err, newServer) {
    if (err) {
      return t.fail();
    }
    server = newServer;
    t.end();
  });
});

// tape('check that the DB is empty', function (t) {
//   tagsPool.connect(function (err, client, done) {
//     Hoek.assert(!err, err);
//     client.query('select * from tags;', function (dbErr, results) {
//       Hoek.assert(!dbErr, dbErr);
//       t.equal(results.rows.length, 0, 'The tags table has 0 rows');
//       done();
//       t.end();
//     });
//   });
// });


tape('check that plugin is being attached to the request object', function (t) {
  server.inject({
    method: 'GET',
    url: '/'
  }, function (res) {
    t.equal(res.statusCode, 200, 'Looks for the endpoint where method is attached to request object.');
    t.ok(JSON.parse(res.payload).length, tags.length, 'There are the correct number of tags in the DB after the plugin is added');
    t.end();
  });
});


tape('teardown', function (t) {
  tagsPool.end(function () {
    t.end();
  });
});
