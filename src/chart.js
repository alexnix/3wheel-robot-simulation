define(['chart-loader'], function(){
	google.charts.load('current', {'packages':['corechart', 'line']});

	google.charts.setOnLoadCallback(drawChart);
	var data, chart, t = 1;

	function drawChart() {	
		data = new google.visualization.DataTable();
		data.addColumn('number', 'Generatia');
		data.addColumn('number', 'Fitnessul celui mai bun individ');


		var options = {
			 chart: {
                    title: 'Feedback Odenplan'
                },
		};

		chart = new google.visualization.LineChart(document.getElementById('chart_div'));

		chart.draw(data, google.charts.Line.convertOptions(options));

	}
	
	var chartFacade = {};

	chartFacade.add = function(val) {
		console.log(t, val);
		data.addRows([[t++, val]]);
		chart.draw(data);
	}	

	chartFacade.empty = function() {
		t = 1;
		drawChart();
	}

	chartFacade.getImage = function() {
		return chart.getImageURI();
	}

	return chartFacade;

});
