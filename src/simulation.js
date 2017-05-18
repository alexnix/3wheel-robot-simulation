requirejs(["Neuroevolution", "chart", (Neuroevolution, Chart) => {
	Neuvol = new Neuroevolution({
		population: 50,
		network:[4, [4], 2],
		elitism: 2,            
    	randomBehaviour:0.6,
    	mutationRate:0.3, 
    	mutationRange:0.3, 
	});
}]);
// var game;
// var FPS = 60;
// var size = 30;

// var Util = {
// 	movement: function(dx, dy, theta) {
// 		return {
// 			dx: dx*Math.cos(theta) - dy*Math.sin(theta),
// 			dy: dx*Math.sin(theta) + dy*Math.cos(theta),
// 		}
// 	},
// 	/* Discrete Fréchet Distance
//  	 * By Andreas Argelius http://argeli.us/ */
// 	discreteFrechetDistance: function(a, b) {
// 	    var dist = function(p1, p2) {
// 	      return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2)); 
// 	    };

// 	    var C = new Float32Array(a.length * b.length),
// 	      dim = a.length,
// 	      i, j;

// 	    C[0] = dist(a[0], b[0]);

// 	    for (j = 1; j < dim; j++) {
// 	      C[j] = Math.max(C[j-1], dist(a[0], b[j]));
// 	    }

// 	    for (i = 1; i < dim; i++) {
// 	      C[i*dim] = Math.max(C[(i-1)*dim], dist(a[i], b[0]));
// 	    }

// 	    for (i = 1; i < dim; i++ ) {
// 	      for (j = 1; j < dim; j++) {
// 	        C[i*dim+j] = Math.max(
// 	          Math.min(C[(i-1)*dim+j], C[(i-1)*dim+j-1], C[i*dim+j-1]),
// 	          dist(a[i], b[j])
// 	        );
// 	      }
// 	    }

// 	    return C[C.length-1];
// 	}
// }

// var Robot = function() {
// 	this.x = 250;
// 	this.y = 250;
// 	this.theta = 1/2*Math.PI;
// 	this.score = 0;
// 	this.alive = true;
// 	this.steps = 0;
// 	this.path = [];
// }

// Robot.prototype.isDead = function() {
// 	return this.steps ++== 1000;
// }

// Robot.prototype.move = function(f) {
// 	this.x += (f[0] > 0.5 ? 1 : -1);
// 	this.y += (f[1] > 0.5 ? 1 : -1);
// 	// this.theta += f[2];
// 	this.path.push([this.x, this.y]);
// }

// Robot.prototype.display = function() {
// 	var dp1 = Util.movement(0, size, this.theta);
// 	var dp2 = Util.movement(size, -size, this.theta);
// 	var dp3 = Util.movement(-size, -size, this.theta);

// 	game.context.fillStyle = "#FFCC00";
// 	game.context.beginPath();
// 	game.context.moveTo(this.x + dp1.dx, this.y + dp1.dy);
// 	game.context.lineTo(this.x + dp2.dx, this.y + dp2.dy);
// 	game.context.lineTo(this.x + dp3.dx, this.y + dp3.dy);
// 	game.context.closePath();
// 	game.context.fill();

// 	game.context.fillStyle = "#FF0000";
// 	game.context.beginPath();
// 	// game.context.fillRect(this.x + dp1.dx, this.y + dp1.dy, 5, 5);
// 	game.context.fillRect(this.x, this.y, 5, 5); 
// 	game.context.closePath();
// 	game.context.fill();	
// }

// var speed = function(fps){
// 	FPS = parseInt(fps);
// }

// var Target = function() {
// 	this.x = 250;
// 	this.y = 250;
// 	this.dest_x = Math.round(Math.random() * game.width);
// 	this.dest_y = Math.round(Math.random() * game.height);
// 	this.path = [];
// }

// Target.prototype.display = function() {
// 	game.context.fillStyle = "#0000FF";
// 	game.context.fillRect(this.x, this.y, 5, 5); 
// 	game.context.fill();
// }

// Target.prototype.update = function() {
// 	if(this.x != this.dest_x) {
// 		this.x += this.x > this.dest_x ? -1 : 1;
// 	} else {
// 		this.dest_x = Math.round(Math.random() * game.width);
// 	}

// 	if(this.y != this.dest_y) {
// 		this.y += this.y > this.dest_y ? -1 : 1;
// 	} else {
// 		this.dest_y = Math.round(Math.random() * game.height);
// 	}
// 	this.path.push([this.x, this.y]);
// }

// var Game = function(){
// 	var canvas = $("#canvas")[0];
// 	this.context = canvas.getContext("2d");
// 	this.width = $("#canvas").width();
// 	this.height = $("#canvas").height();
// 	this.gen = [];
// 	this.robots = [];
// 	this.generation = 0;
// 	this.alives = 0;
// 	this.target = {
// 		x: 250,
// 		y: 250,
// 	};
// 	this.target;
// }

// Game.prototype.start = function(){
// 	this.robots = [];
// 	this.target = new Target();
// 	this.gen = Neuvol.nextGeneration();
// 	for(var i in this.gen) {
// 		this.robots.push(new Robot());
// 	}	
// 	this.generation++;
// 	this.alives = this.robots.length;
// }

// Game.prototype.update = function(){
// 	if(this.alives == 0){
// 		add(1/Math.min.apply(null, this.robots.map(r => {
// 			return r.score;
// 		})))
// 		this.start();
// 	}
// 	this.target.update();
// 	for(var i in this.robots) {
// 		if(this.robots[i].alive) {
// 			var inputs = [
// 				this.target.x/this.width, this.target.y/this.height,
// 				this.robots[i].x/this.width, this.robots[i].y/this.height
// 			];

// 			var f = this.gen[i].compute(inputs);

// 			this.robots[i].move(f);
// 			this.robots[i].score += Math.sqrt(
// 					(this.robots[i].x - this.target.x)*(this.robots[i].x - this.target.x) +
// 					(this.robots[i].y - this.target.y)*(this.robots[i].y - this.target.y) 
// 				);

// 			if(this.robots[i].isDead()) {
// 				this.robots[i].alive = false;
// 				this.alives--;
// 				// var fd = Util.discreteFrechetDistance(this.robots[i].path, game.target.path)
// 				Neuvol.networkScore(this.gen[i], 1/this.robots[i].score);
// 			}
// 		}
// 	}

// 	var self = this;
// 	setTimeout(function(){
// 		console.log(1);
// 		self.update();
// 	}, 1);
// 	// if(FPS == 0){
// 	// 	setZeroTimeout(function(){
// 	// 		self.update();
// 	// 	});
// 	// }else{
// 	// 	setTimeout(function(){
// 	// 		self.update();
// 	// 	}, 1/FPS);
// 	// }
// }

// Game.prototype.display = function(){
// 	this.context.clearRect(0, 0, this.width, this.height);
// 	for(var i in this.robots) {
// 		this.robots[i].display();
// 	}
// 	this.target.display();
// 	var self = this;
// 	requestAnimationFrame(function(){
// 		self.display();
// 	});
// }

// Game.prototype.isItEnd = function() {
// 	for(var i in this.robots) 
// 		if(this.robots[i].alive)
// 			return true;
// 	return true;
// }

// $(document).ready(function(){
// 	Neuvol = new Neuroevolution({
// 		population: 50,
// 		network:[4, [4], 2],
// 		elitism: 2,            
//     	randomBehaviour:0.6,
//     	mutationRate:0.3, 
//     	mutationRange:0.3, 
// 	});
// 	setTimeout(() => {
// 		game = new Game();
// 		game.start();
// 		// while(1) 
// 			game.update();
// 	}, 1000)
	
// 	// game.display();

// });