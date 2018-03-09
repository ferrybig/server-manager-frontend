'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BACKEND_URL: JSON.stringify(process.env.BACKEND_URL || 'ws://localhost:8070/websocket'),
})
