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


io.sockets.on('connection', function(socket){
  //send message event
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data} );
  })
})






server.listen(process.env.PORT || 9000);

// app.listen(app.get('port'), function() {
//   console.log('My express server is running at localhost', app.get('port'));
// });
//
// //We are only exporting in case we wish to conduct testing, otherwise we do not need to export app
// module.exports = app;
