	// Load the Visualization API and the corechart package.
	google.charts.load('current', {'packages':['corechart', 'line']});

	// Set a callback to run when the Google Visualization API is loaded.
	google.charts.setOnLoadCallback(drawChart);
	// Callback that creates and populates a data table,
	// instantiates the pie chart, passes in the data and
	// draws it.
	var data, chart, t = 1;
	
	function drawChart() {	
		data = new google.visualization.DataTable();
		data.addColumn('number', 'Generatia');
		data.addColumn('number', 'Fitnessul celui mai bun individ');

		var options = {
		chart: {
		  title: 'Evolutia fitness-ului',
		},
		width: 900,
		height: 500,
		axes: {
		  x: {
		    0: {side: 'bottom'}
		  }
		}
		};

		chart = new google.charts.Line(document.getElementById('chart_div'));

		chart.draw(data, google.charts.Line.convertOptions(options));
	}
	function add(val) {
		console.log(val);
		data.addRows([[t++, val]]);
		chart.draw(data);
	}
	
