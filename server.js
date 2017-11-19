
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
server.listen(8080, '127.0.0.1');

var wss = new WSS({ port: 8084 });
wss.on('connection', function(socket) {
  console.log('Opened Connection');

  socket.on('close', function() {
    console.log('Closed Connection');
  });

});

var tickerID = [1,2,3,4,5,6,7,8,9,10]; 
var tickerMap ={
    1 : 'Apple',
    2 : 'Google',
    3 : 'Facebook',
    4 : 'Microsoft',
    5 : 'Oracle',
    6 : 'Directi',
    7 : 'Zoho',
    8 : 'Amazon',
    9 : 'Flipkart',
    10: 'Paytm'
  }

var num1=200,num2=1000;
var broadcast = function() {
  var today = new Date();
  var tickerArray=[];
  for(i=0;i<5;i++)
  {
    var rand = tickerID[Math.floor(Math.random() * tickerID.length)];
    if(tickerArray.indexOf(rand)<0){
      tickerArray.push(rand);
    }
  }
  var outerArray = [];
  for(i=0;i<tickerArray.length;i++)
  {
    var newvalue = (Math.random() * (num2-num1 + 1) + num1).toFixed(2);
    var item={};
    item["tickerid"]=tickerArray[i];
    item["tickerName"]=tickerMap[tickerArray[i]];
    item["sharePrice"]=newvalue;
    item["tradeTime"]=today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
    outerArray.push(item);
  }


  wss.clients.forEach(function each(client) {
    client.send(JSON.stringify(outerArray));
    console.log('Sent: ' + JSON.stringify(outerArray));
  });
}
setInterval(broadcast, 4000);
