var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var request = require('request')
var fs = require('fs')
app.use(express.static(__dirname))

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
app.post('/keyword', function (req, res) {
  console.log(req.body)
  var newKeyWord = req.body
  var keyWord = fs.readFileSync('./keyword.json')
  keyWord = JSON.parse(keyWord)
  keyWord[newKeyWord.key] = newKeyWord.value
  keyWord = JSON.stringify(keyWord)
  console.log(keyWord)
  fs.writeFile('./keyword.json', keyWord, (err) => {
    if (err) {
      res.send(err)
      return
    }
    res.send("It's saved!")
  })
})
app.get('/keyword', function (req, res) {
  console.log(req.body)
  var keyWord = fs.readFileSync('./keyword.json')
  keyWord = JSON.parse(keyWord)
  keyWord = JSON.stringify(keyWord)
  res.send(keyWord)
})
app.delete('/keyword', function (req, res) {
  console.log(req.body)
  var keyWord = fs.readFileSync('./keyword.json')
  keyWord = JSON.parse(keyWord)
  delete keyWord[req.body.key]
  keyWord = JSON.stringify(keyWord)
  fs.writeFile('./keyword.json', keyWord, (err) => {
    if (err) {
      res.send(err)
      return
    }
    res.send("It's saved!")
  })
})
app.post('/webhook/', function (req, res) {
  res.sendStatus(200)
  var messaging_events = req.body.entry[0].messaging
  var event
  var sender
  var text
  var respone
  var keyWord
  for (var i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]
    sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text
      text = text.split(' ')
      if (text[0] === 'sum') {
        respone = sum(text)
      }else if (text[0] === 'max') {
        respone = max(text)
      }else if (text[0] === 'min') {
        respone = min(text)
      }else if (text[0] === 'avg') {
        respone = avg(text)
      } else {
        text = text.join()
        keyWord = fs.readFileSync('./keyword.json')
        console.log(keyWord)
        keyWord = JSON.parse(keyWord)
        if (keyWord[text]) {
          sendTextMessage(sender, keyWord[text])
        }
        return
      }
      console.log('1', sender, respone)
      sendTextMessage(sender, respone)
    }
  }
})
function sum (data) {
  var ans = 0
  for (var i = 1;i < data.length;i++) {
    ans += parseInt(data[i], 10)
  }
  return ans
}
function max (data) {
  var ans = parseInt(data[1], 10)
  for (var i = 2;i < data.length;i++) {
    if (parseInt(data[i], 10) > ans) {
      ans = parseInt(data[i], 10)
    }
  }
  return ans
}
function min (data) {
  var ans = parseInt(data[1], 10)
  for (var i = 2;i < data.length;i++) {
    if (parseInt(data[i], 10) < ans) {
      ans = parseInt(data[i], 10)
    }
  }
  return ans
}
function avg (data) {
  var ans = 0
  for (var i = 1;i < data.length;i++) {
    ans += parseInt(data[i], 10)
  }
  return ans / (data.length - 1)
}
var token = 'EAAG4ZCpU9FlABAPGEs9n6SdY4nCvjMiGAY7N743o4Lk4MjVPjOkPrkehxx0ybKNiNZCYYuRYj3W6TCC6psI1x1fAWngDA7KbsTfRXvAsPMeWboGCHkR9SD6wBlZCJDZB8cA9w8OhwMUCLuxFX6orrm7N2zXxrBWpYDrsQqLFnAZDZD'

function sendTextMessage (sender, text) {
  console.log(sender, text)
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {
        text: text
      }
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function () {
  console.log('Server Start at port ', app.get('port'))
})
