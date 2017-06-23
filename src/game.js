define(["Neuroevolution", "chart", "Robot", "Target"], function(Neuroevolution, chart, Robot, Target){
	var saveData = (function () {
	    var a = document.createElement("a");
	    document.body.appendChild(a);
	    a.style = "display: none";
	    return function (dataURL, fileName) {

	    	var data = atob( dataURL.substring( "data:image/png;base64,".length ) ),
			    asArray = new Uint8Array(data.length);

			for( var i = 0, len = data.length; i < len; ++i ) {
			    asArray[i] = data.charCodeAt(i);    
			}

			var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );


	        var url = window.URL.createObjectURL(blob);
	        a.href = url;
	        a.download = fileName;
	        a.click();
	        window.URL.revokeObjectURL(url);
	    };
	}());

	var default_config = {
		neuroevolution: {
			population: 50,
			network:[2, [4], 2],
			elitism: 2,            
	    	randomBehaviour:0.6,
	    	mutationRate:0.3,
	    },

	    robot_fitness: function(robot, game) {
	    	return 1e6/robot.score
	    }
	};

	var Game = function(config){
		var canvas = $("#canvas")[0];
		this.context = canvas.getContext("2d");
		this.width = $("#canvas").width();
		this.height = $("#canvas").height();
		this.gen = [];
		this.robots = [];
		this.generation = 0;
		this.alives = 0;
		this.target = {
			x: 250,
			y: 250,
		};
		this.target;
		this.Neuvol = new Neuroevolution(Object.assign(default_config.neuroevolution, config.neuroevolution));
		this.config = Object.assign(default_config, config);
		chart.empty();
	}

	Game.prototype.start = function(){
		this.robots = [];
		this.target = new Target(this);
		this.gen = this.Neuvol.nextGeneration();
		for(var i in this.gen) {
			this.robots.push(new Robot(this));
		}	
		this.generation++;
		this.alives = this.robots.length;
	}

	Game.prototype.update = function(){

		if(this.alives == 0){
			chart.add(1e6/Math.min.apply(null, this.robots.map(r => {
				return r.score;
			})))
			this.start();
		}
		this.target.update();
		for(var i in this.robots) {
			if(this.robots[i].alive) {
				var inputs = [
					(this.robots[i].x - this.target.x) / this.width,
					(this.robots[i].y - this.target.y) / this.height
				];

				var f = this.gen[i].compute(inputs);

				this.robots[i].move(f, this.robots[i]);
				this.robots[i].score += Math.sqrt(
						(this.robots[i].x - this.target.x)*(this.robots[i].x - this.target.x) +
						(this.robots[i].y - this.target.y)*(this.robots[i].y - this.target.y) 
					);

				if(this.robots[i].isDead()) {
					this.robots[i].alive = false;
					this.alives--;
					// var fd = Util.discreteFrechetDistance(this.robots[i].path, game.target.path)
					var score = this.config.robot_fitness(this.robots[i], this)
					this.Neuvol.networkScore(this.gen[i], score);
				}
			}
		}

		if(this.config.visual == true) {
			var self = this;
			setTimeout(function(){
				self.update();
			}, 1);
		}
	}

	Game.prototype.display = function(){
		this.context.clearRect(0, 0, this.width, this.height);
		for(var i in this.robots) {
			this.robots[i].display(this.context);
		}
		this.target.display(this.context);
		var self = this;
		requestAnimationFrame(function(){
			self.display();
		});
	}

	Game.prototype.isItEnd = function() {
		for(var i in this.robots) 
			if(this.robots[i].alive)
				return true;
		return true;
	}

	Game.prototype.saveGeneration = function() {

		var genomes = [];

		var max_score = 1e6/this.robots[0].score;
		var max_score_idx = 0

		for(var i in this.robots) {
			this.robots[i].alive = false;
			this.alives--;
			this.Neuvol.networkScore(this.gen[i], 1e6/this.robots[i].score);

			genomes.push({
				score: 1e6/this.robots[i].score,
				nn_str: JSON.stringify(this.gen[i].getSave())
			});

			if(1e6/this.robots[i].score > max_score) {
				max_score = 1e6/this.robots[i].score;
				max_score_idx = i;
			}
		}

		// genomes is a string that can be used to restore a generation
	}

	Game.prototype.saveChart = function(title) {
		saveData(chart.getImage(), title || "chart.png")
	}

	return Game;
});
