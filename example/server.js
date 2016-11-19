'use strict';

var Hapi = require('hapi');

var tagsData = require('./tags.json');
var categoriesData = require('./categories.json');
var tags = require('../lib/index.js');
var pg = require('pg');

function init (config, callback) {
  var server = new Hapi.Server();
  var tagsPool = new pg.Pool(config.pg);

  server.connection({ port: config.port });

  server.register([{
    register: tags,
    options: {
      tags: config.tagsData || tagsData,
      categories: config.categoriesData || categoriesData,
      pool: tagsPool
    }
  }], function (err) {
    if (err) {
      return callback(err);
    }
    server.route([{
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        request.pg.tags.getTags(function (error, listTags) { //eslint-disable-line
          return reply(listTags);
        });
      }
    }, {
      method: 'GET',
      path: '/getAllActive',
      handler: function (request, reply) {
        request.pg.tags.getAllActive(function (error, allTags) { //eslint-disable-line
          return reply(allTags);
        });
      }
    }, {
      method: 'GET',
      path: '/addTags',
      handler: function (request, reply) {
        request.pg.tags.addTags('challenges', 1, [1, 2],function (error, added) { //eslint-disable-line
          return reply(added);
        });
      }
    }, {
      method: 'GET',
      path: '/getByTag',
      handler: function (request, reply) {
        // console.log(request.query.type, request.query.tag);
        return reply('hello');
      }
    }
    ]);

    return callback(null, server, tagsPool);
  });
}

module.exports = init;
