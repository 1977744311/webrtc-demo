const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const http1 = require('./http')
const http = require('http')
const https = require('https')
const socket = require('./socket')
const ipaddrs = require('./ipaddrs')
const koaLogger = require('koa-logger')
const koaStatic = require('koa-static')
const koaParser = require('koa-parser')

const app = new Koa()

app.use(koaLogger())
app.use(koaStatic(path.join(__dirname, '../docs')))
app.use(koaParser())

// http请求方式建立连接
http1(app)

const server = http.createServer(
  // {
  //   key: fs.readFileSync(path.join(__dirname, '../tls/server.key')), // tls文件路径
  //   cert: fs.readFileSync(path.join(__dirname, '../tls/server.crt')) // tls文件路径
  // },
  app.callback()
)

// socket方式建立连接
socket(server)

server.listen(9070, () => {
  console.log('Server running on:')
  console.log(`\n${ipaddrs.map(url => `    http://${url}:9070`).join('\n')}\n`)
})
