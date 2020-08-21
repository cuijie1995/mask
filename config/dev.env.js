'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API: '"http://192.168.0.185:8090"'

  // API: '"https://192.168.0.185:44384"'
  // API: '"http://192.168.0.153:8080"'
})
