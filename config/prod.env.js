'use strict'
module.exports = {
  NODE_ENV: '"production"',
  BACKEND_URL: JSON.stringify(process.env.BACKEND_URL || 'ws://localhost:8070/websocket'),
}
