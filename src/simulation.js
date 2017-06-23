requirejs(['game'], function(Game) {
	
	var configs = [
		
		{
			title: "p50_e2_m0_r06",
			visual: true,
			robot_move: function(f, robot) {

			},
			
			robot_fitness: function(robot, game) {

			},

			neuroevolution: {
				mutationRate: 0,
			}
		},

	];

	
	setTimeout(function() {
		// for(var i in configs) {
		// 	var config = configs[i];
		// 	var g  = new Game(config);
		// 	g.start();
		// 	g.display();
		// 	while(g.generation < 150)	
		// 		g.update();
		// 	g.saveChart(config.title);
		// }

		var g  = new Game({
			visual: true,
			// robot_move: function(f, robot) {
			// 	robot.x += 1;
			// }
		});
		g.start();
		g.update();
		g.display();
	}, 1000)
	
	

})