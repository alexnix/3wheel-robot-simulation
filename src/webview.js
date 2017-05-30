requirejs(["Neuroevolution", "Robot", "Target", "touch-detector"], function(Neuroevolution, Robot, Target, touchDetector){
	var Neuvol = new Neuroevolution({
		population: 50,
		network:[4, [4], 2],
		elitism: 2,            
    	randomBehaviour:0.6,
    	mutationRate:0.3, 
    	mutationRange:0.3, 
	});

	var game;

	touchDetector.init({
		canvas: document.getElementById('myCanvas'),

		touchstartCallback: function(event) {
			game.start();
			game.target.setPosition(event.changedTouches[0].pageX,event.changedTouches[0].pageY);
		},

		touchMoveCollback: function(event) {
			game.target.setPosition(event.changedTouches[0].pageX,event.changedTouches[0].pageY);
		},

		touchEndCallback: function(event) {
			game.end();
		},

	});

	var Game = function(){
		var canvas = document.getElementById('myCanvas');
		this.context = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;
		this.gen = [];
		this.robots = [];
		this.generation = 0;
		this.alives = 0;
		this.target = {
			x: this.width / 2,
			y: this.height / 2,
		};
		this.target = new Target(this, 15);
	}

	Game.prototype.start = function(){
		this.robots = [];
		this.target = new Target(this, 15);
		this.gen = Neuvol.nextGeneration();
		for(var i in this.gen) {
			this.robots.push(new Robot(this, 50));
		}	
		this.generation++;
		this.alives = this.robots.length;
	}

	Game.prototype.update = function(){
		for(var i in this.robots) {
			if(this.robots[i].alive) {
				var inputs = [
					this.target.x/this.width, this.target.y/this.height,
					this.robots[i].x/this.width, this.robots[i].y/this.height
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
					Neuvol.networkScore(this.gen[i], 1/this.robots[i].score);
				}
			}
		}

		var self = this;
		setTimeout(function(){
			self.update();
		}, 1);
	}

	Game.prototype.display = function(){
		this.context.clearRect(0, 0, this.width, this.height);
		for(var i in this.robots) {
			this.robots[i].display(this.context);
		}
		if(this.target) {
			this.target.display(this.context);
		}
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

	Game.prototype.end = function() {
		
		if (typeof(Storage) !== "undefined") {
		    loclaStorage.last_gen = JSON.stringify(this.gen);
		} else {
		    alert("No support for local storage.")''
		}

		for(var i in this.robots) {
			this.robots[i].alive = false;
			this.alives--;
			Neuvol.networkScore(this.gen[i], 1/this.robots[i].score);
		}

	}

	game = new Game();
	game.update();
	game.display();
});
