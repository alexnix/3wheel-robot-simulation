requirejs(['game', 'util'], function(Game, Util) {
	
	var configs = [
		
		{
			visual: true,
			title: "control_total",
			robot_move: function(f, robot) {

				if(f[0] > 0.5)
					robot.x += -1;
				if(f[1] > 0.5)
					robot.x += 1;

				if(f[2] > 0.5)
					robot.y += -1;
				if(f[3] > 0.5)
					robot.y += 1;

			},

			neuroevolution: {
				network: [2, 4, 4],
			}
		},


	];

	
	setTimeout(function() {
		for(var i in configs) {
			var config = configs[i];
			var g  = new Game(config);
			g.start();
			g.display();
			window.g = g;
			// while(g.generation < 150)	
				g.update();
			// g.saveChart(config.title);
		}
	}, 1000)
	
	

})