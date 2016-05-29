var express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var app = express()
var request = require('request')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'bot_messenger_page') {
    res.send(req.query['hub.challenge'])
    return
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  var event
  var sender
  var text
  for (var i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]
    sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text
      console.log(text)
    }
  }
  res.sendStatus(200)
})

var token = 'EAAG4ZCpU9FlABAPGEs9n6SdY4nCvjMiGAY7N743o4Lk4MjVPjOkPrkehxx0ybKNiNZCYYuRYj3W6TCC6psI1x1fAWngDA7KbsTfRXvAsPMeWboGCHkR9SD6wBlZCJDZB8cA9w8OhwMUCLuxFX6orrm7N2zXxrBWpYDrsQqLFnAZDZD'

function sendTextMessage (sender, text) {
}

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function () {
  console.log('Server Start at port ', app.get('port'))
})
