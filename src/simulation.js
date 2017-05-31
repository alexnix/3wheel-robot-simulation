requirejs(["Neuroevolution", "chart", "Robot", "Target"], function(Neuroevolution, chart, Robot, Target){
	var saveData = (function () {
	    var a = document.createElement("a");
	    document.body.appendChild(a);
	    a.style = "display: none";
	    return function (data, fileName) {
	        var json = JSON.stringify(data),
	            blob = new Blob([json], {type: "octet/stream"}),
	            url = window.URL.createObjectURL(blob);
	        a.href = url;
	        a.download = fileName;
	        a.click();
	        window.URL.revokeObjectURL(url);
	    };
	}());

	var Neuvol = new Neuroevolution({
		population: 50,
		network:[2, [4], 2],
		elitism: 2,            
    	randomBehaviour:0.6,
    	mutationRate:0.3, 
    	mutationRange:0.3, 
	});

	var Game = function(){
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
	}

	Game.prototype.start = function(){
		this.robots = [];
		this.target = new Target(this);
		this.gen = Neuvol.nextGeneration();
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

				this.robots[i].move(f);
				this.robots[i].score += Math.sqrt(
						(this.robots[i].x - this.target.x)*(this.robots[i].x - this.target.x) +
						(this.robots[i].y - this.target.y)*(this.robots[i].y - this.target.y) 
					);

				if(this.robots[i].isDead()) {
					this.robots[i].alive = false;
					this.alives--;
					// var fd = Util.discreteFrechetDistance(this.robots[i].path, game.target.path)
					Neuvol.networkScore(this.gen[i], 1e6/this.robots[i].score);
				}
			}
		}

		var self = this;
		setTimeout(function(){
			// console.log(1);
			self.update();
		}, 1);
		// if(FPS == 0){
		// 	setZeroTimeout(function(){
		// 		self.update();
		// 	});
		// }else{
		// 	setTimeout(function(){
		// 		self.update();
		// 	}, 1/FPS);
		// }
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
			Neuvol.networkScore(this.gen[i], 1e6/this.robots[i].score);

			genomes.push({
				score: 1e6/this.robots[i].score,
				nn_str: JSON.stringify(this.gen[i].getSave())
			});

			if(1e6/this.robots[i].score > max_score) {
				max_score = 1e6/this.robots[i].score;
				max_score_idx = i;
			}
		}

		saveData(genomes, "saved_generation.json");
	}

	Game.prototype.saveChartData = function(name) {

	}

	window.game = new Game();

	game.start();
	game.update();
	game.display();
});
