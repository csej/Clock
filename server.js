var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('clock.html'); });

app.use(express.static('public')); // dir serving static files (css, js...)

io.on('connection', function(socket){
    console.log('A user connected'); });

http.listen(5000, function(){
    console.log('Listening on localhost:5000'); });


var schedule = require('node-schedule');
var exec = require('child_process').exec;


// schedule of emit events
var lag = 5; // period in seconds
var rule = new schedule.RecurrenceRule();
var list = [];
for (var i = 0; i <= 55; i+=lag) {
	list.push(i); }
rule.second = list;


// build suffix of file name
var i;
function swap() {
	i = (i+1) % 2;
	return i; }


var file = 'clock0';

var r = schedule.scheduleJob(rule, function(){ // exact datetime (not just frequency)

    io.emit('play', file); // client play current file (ogg/mp3 type is managed on client side)

	var d = new Date();
//	console.log('il est : '+d)
    d.setSeconds(d.getSeconds()+2*lag); // date to speak
//	console.log('il sera : '+d)

    var cmd = '';
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    cmd = 'sox silence.ogg ' +h+ '.ogg h.ogg ';
    if (m != 0) {
            cmd += m+'.ogg m.ogg '; }
    if (s != 0) {
            cmd += s+'.ogg s.ogg ';
            fileBeep = '1beep.ogg ';
    } else {
            fileBeep = '4beep.ogg '; }

    file = 'clock'+ swap(); // new file name

    cmd += file+ 'temp.ogg ';
    cmd += '&& sox -m ' +file+ 'temp.ogg ' +fileBeep+file+ '.ogg '; // build a fixed length file starting with 1 beep (and eventually ending with 3 beeps)
    cmd += '&& sox ' +file+ '.ogg ' +file+ '.mp3 '; // mp3 version of ogg
    cmd += '&& cp ' +file+ '.ogg public/' +file+ '.ogg '; // move to public zone
    cmd += '&& cp ' +file+ '.mp3 public/' +file+ '.mp3 '; // move to public zone
    cmd += '&& rm ' +file+ 'temp.ogg'; // clean temp files
//	console.log(cmd+'\n')

    exec(cmd, function(error, stdout, stderr) {} );

});
