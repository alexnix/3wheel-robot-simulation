requirejs(['game'], function(Game) {
	var config = {
		neuroevolution: {
			population: 50,
			elitism: 2
		},
		
		robot: {
			move: function(f, robot) {
				this.x += (f[0] > 0.5 ? 3 : -3);
				this.y += (f[1] > 0.5 ? 3 : -3);
				// this.theta += f[2];
				// this.path.push([this.x, this.y]);
			},

			evaluate: function(robot, game) {
				return (1e6/robot.score);
			}
		}
	}
	
	var configs = [
		{
			title: "p50_e0_m03_r06",
			neuroevolution: {
				elitism: 0,
			}
		},

		{
			title: "p50_e05_m03_r06",
			neuroevolution: {
				elitism: 0.5,
			}
		},

		{
			title: "p50_e2_m03_r06",
			neuroevolution: {
				elitism: 2,
			}
		},

		{
			title: "p50_e50_m03_r06",
			neuroevolution: {
				elitism: 50,
			}
		},
	];

	
	setTimeout(function() {
		for(var i in configs) {
			var config = configs[i];
			var g  = new Game(config);
			g.start();
			g.display();
			while(g.generation < 150)	
				g.update();
			g.saveChart(config.title);
		}
	}, 1000)
	
	

})