// MY MAIN APP JS

var express = require('express');
var app = express();
var ejs = require('ejs');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static('./public'));



app.get('/', function(req, res){
  res.render('index.html');
})

//empty user array
var usernames = [];

io.sockets.on('connection', function(socket){

  //creating new users
  socket.on('new user', function(data, callback){
    if(usernames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  //update usernames after creation
  function updateUsernames() {
    io.sockets.emit('usernames', usernames);
  }
  //send message event
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user: socket.username} );
  });

  //disconnect event to remove users
  socket.on('disconnect', function(data){
    if(!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  })
})






server.listen(process.env.PORT || 8000);

// app.listen(app.get('port'), function() {
//   console.log('My express server is running at localhost', app.get('port'));
// });
//
// //We are only exporting in case we wish to conduct testing, otherwise we do not need to export app
// module.exports = app;
