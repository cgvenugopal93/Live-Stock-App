
var socket = new WebSocket('ws://localhost:8085/');
socket.onopen = function(event) {
  log('<b>Opened connection<b>');
}

socket.onerror = function(event) {
  log('Error: ' + JSON.stringify(event));
}

socket.onmessage = function (event) {
  log(event.data);
  chartlog(event.data)
  handleUpdateMessage(event.data);
}

socket.onclose = function(event) {
  log('<b>Closed connection!!! Refresh page to again start live stock</b>');
}

document.querySelector('#close').addEventListener('click', function(event) {
  socket.close();
  $('#closeLog').show();
  
});

document.querySelector('#history').addEventListener('click', function(event) {
  socket.close();
  $('#log').show();
});

$("[id^='showgraph-']").bind('click', function(event) {
  var datapoints=[];
  var parentDiv = $(this).closest("[id^='tickerid-']"); 
  var tickerName = $(parentDiv).find('#tickerName').text()	
  var parentid = $(parentDiv).attr('id');
  var idarray = parentid.split('-');
  var today = new Date();
  $("#chartlog li").each(function(){
  	var stockData = $(this).text();
  	stockData = JSON.parse(stockData);
  	var item={};
  	for(i=0;i<stockData.length;i++){
  		if(stockData[i].tickerid==idarray[1]){
  			var price = parseFloat(stockData[i].sharePrice);
  			var time = stockData[i].tradeTime;
  			var timeArray = time.split(":");
  			item["x"]=new Date(today.getFullYear(), today.getMonth(), today.getDate(),timeArray[0]);//for x-axis input the hour got from server
  			item["y"]=price;//for y-axis input the stock price
  			datapoints.push(item);
  		}
  	}
  });
  LiveStockChart.init(datapoints,tickerName);// Draw chart

});

var log = function(text) {
  var li = document.createElement('li');
  li.innerHTML = text;
  document.getElementById('log').appendChild(li);
}

var chartlog = function(text) {
  var li = document.createElement('li');
  li.innerHTML = text;
  document.getElementById('chartlog').appendChild(li);
}

window.addEventListener('beforeunload', function() {
  socket.close();
});

function handleUpdateMessage(data){
	var stockData = JSON.parse(data);
	for(i=0;i<stockData.length;i++){
		var tickerId = stockData[i].tickerid;
		var newSharePrice = parseFloat(stockData[i].sharePrice);
		var openValue = $('#tickerid-'+tickerId).find('#curValue span').text();
		$('#tickerid-'+tickerId).find('#newValue span').text(newSharePrice);
		shareDiff = (newSharePrice-openValue).toFixed(2);
		shareDiffPerc = (shareDiff/openValue)*100;
		var today = new Date();
		$('#tickerid-'+tickerId).find('#tradeTime').text(today.getHours()+":"+today.getMinutes()+":"+today.getSeconds());
		
		if(shareDiff>0)
		{
			$('#tickerid-'+tickerId).find('#incValue').text('+'+shareDiff);
			$('#tickerid-'+tickerId).find('#percInc').text('('+shareDiffPerc.toFixed(2)+'%)');
			$('#tickerid-'+tickerId).css('background','#4CAF50');
		}
		else{
			$('#tickerid-'+tickerId).find('#incValue').text(shareDiff);
			$('#tickerid-'+tickerId).find('#percInc').text('('+shareDiffPerc.toFixed(2)+'%)');
			$('#tickerid-'+tickerId).css('background','#d62e13');
		}
	}
}
