fs = require 'fs'
express = require 'express'
{TwitterNode} = require 'twitter-node'

app = express.createServer()
io = require('socket.io').listen(app)

# Configuration
app.configure ->
  app.set 'views', __dirname + '/views'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.compiler(src: __dirname + '/public', enable: ['less'])
  app.use app.router
  app.use express.static(__dirname + '/public')

app.configure 'development', ->
  app.use express.errorHandler(dumpExceptions: true, showStack: true)

app.configure 'production', ->
  app.set 'port', 80
  app.use express.errorHandler()

# Routes
app.get '/', (req, res) ->
  res.render 'index.jade',
    locals:
      title: 'Twist Of Pepper'

app.get '/:template.hb', (req, res) ->
  res.writeHead 200, 'Content-Type': 'text/handlebars'
  fs.readFile "./views/#{req.params.template}.hb", (err, data) ->
    throw err if err
    res.end data

buffer = []

twit = new TwitterNode
  user: process.env.TWITTER_U
  password: process.env.TWITTER_P
  track: []

twit.addListener 'error', (err) ->
  console.log err.message

twit.addListener 'tweet', (tweet) ->
  console.log "@#{tweet.user.screen_name}: #{tweet.text}"
  buffer.unshift tweet
  buffer.pop() if buffer.length > 15
  io.sockets.emit 'tweet', tweet

twit.addListener 'end', (resp) ->
  console.log "Twitter connection ended with status: #{resp.statusCode}"

# Read what the user wants to track from stdin
process.stdin.resume()
process.stdin.setEncoding 'utf8'

process.stdin.on 'data', (chunk) ->
  chunk.split('\n').forEach (thing) ->
    if thing isnt ''
      twit.track thing
      console.log "Tracking #{thing}"

process.stdin.on 'end', ->
  twit.stream()

io.sockets.on 'connection', (socket) ->
  # new socket is here!
  socket.emit 'buffer', buffer

app.listen app.set('port') || 3000
