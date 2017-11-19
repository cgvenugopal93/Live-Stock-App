LiveStockChart = new function(){
    this.init = function(data,tickerName)
    {
    	var chart = new CanvasJS.Chart("chartContainer",
	    {
	      title:{
	        text: "Live Stock Chart - "+tickerName
	      },

	      axisX:{
	        title: "Time",
	        labelFormatter: function (e) {
	        return CanvasJS.formatDate( e.value, "hh TT");
	        },
	        interval:2
	      },
	      axisY:{
	        title: "Price"
	      },
	      data: [
	      {        
	        type: "line",
	        dataPoints:data
	      }
	      ]
	    });
		chart.render();
		$('.canvasjs-chart-credit').hide();
    }
}