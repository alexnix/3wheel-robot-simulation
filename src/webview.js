requirejs(["Neuroevolution", "chart", "Robot", "touch-detector"], function(){
	
	var Neuvol, game, target_position, game_end;

	touchDetector.init({
		canvas: document.getElementById('myCanvas'),

		showTrace: true,

		touchstartCallback: function(x, y) {
			game.start();
			target_position = {
				x: x,
				y: y,
			};
			game_end = false;
		},

		touchMoveCollback: function(x, y) {
			target_position = {
				x: x,
				y: y,
			};
		},

		touchEndCallback: function(x, y) {
			game_end = true;
		},
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
			add(1/Math.min.apply(null, this.robots.map(r => {
				return r.score;
			})))
			this.start();
		}
		this.target.update();
		for(var i in this.robots) {
			if(this.robots[i].alive) {
				var inputs = [
					target_position.x/this.width, target_position.y/this.height,
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

	var game = new Game();
	game.update();
	game.display();

});
