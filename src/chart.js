define(['chart-loader'], function(){
	google.charts.load('current', {'packages':['corechart', 'line']});

	google.charts.setOnLoadCallback(drawChart);
	var data, chart, t = 1;
	var empty_data;

	function drawChart() {	
		empty_data = function() {
			data = new google.visualization.DataTable();
			data.addColumn('number', 'Generatia');
			data.addColumn('number', 'Fitnessul celui mai bun individ');
		}
		empty_data();

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
		console.log(val);
		data.addRows([[t++, val]]);
		chart.draw(data);
	}	

	chartFacade.empty = function() {
		// empty_data();
	}

	chartFacade.getImage = function() {
		return chart.getImageURI();
	}

	return chartFacade;

});
