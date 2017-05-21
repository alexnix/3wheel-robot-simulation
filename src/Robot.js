var Util = {
	movement: function(dx, dy, theta) {
		return {
			dx: dx*Math.cos(theta) - dy*Math.sin(theta),
			dy: dx*Math.sin(theta) + dy*Math.cos(theta),
		}
	},
	/* Discrete Fréchet Distance
 	 * By Andreas Argelius http://argeli.us/ */
	discreteFrechetDistance: function(a, b) {
	    var dist = function(p1, p2) {
	      return Math.sqrt(Math.pow(p1[0]-p2[0], 2) + Math.pow(p1[1]-p2[1], 2)); 
	    };

	    var C = new Float32Array(a.length * b.length),
	      dim = a.length,
	      i, j;

	    C[0] = dist(a[0], b[0]);

	    for (j = 1; j < dim; j++) {
	      C[j] = Math.max(C[j-1], dist(a[0], b[j]));
	    }

	    for (i = 1; i < dim; i++) {
	      C[i*dim] = Math.max(C[(i-1)*dim], dist(a[i], b[0]));
	    }

	    for (i = 1; i < dim; i++ ) {
	      for (j = 1; j < dim; j++) {
	        C[i*dim+j] = Math.max(
	          Math.min(C[(i-1)*dim+j], C[(i-1)*dim+j-1], C[i*dim+j-1]),
	          dist(a[i], b[j])
	        );
	      }
	    }

	    return C[C.length-1];
	}
}
var Robot = function() {
	this.x = 250;
	this.y = 250;
	this.theta = 1/2*Math.PI;
	this.score = 0;
	this.alive = true;
	this.steps = 0;
	this.path = [];
	this.size = 20;
}

Robot.prototype.isDead = function() {
	return this.steps ++== 1000;
}

Robot.prototype.move = function(f) {
	this.x += (f[0] > 0.5 ? 1 : -1);
	this.y += (f[1] > 0.5 ? 1 : -1);
	// this.theta += f[2];
	this.path.push([this.x, this.y]);
}

Robot.prototype.display = function(context) {
	var dp1 = Util.movement(0, this.size, this.theta);
	var dp2 = Util.movement(this.size, -this.size, this.theta);
	var dp3 = Util.movement(-this.size, -this.size, this.theta);

	context.fillStyle = "#FFCC00";
	context.beginPath();
	context.moveTo(this.x + dp1.dx, this.y + dp1.dy);
	context.lineTo(this.x + dp2.dx, this.y + dp2.dy);
	context.lineTo(this.x + dp3.dx, this.y + dp3.dy);
	context.closePath();
	context.fill();

	context.fillStyle = "#FF0000";
	context.beginPath();
	// context.fillRect(this.x + dp1.dx, this.y + dp1.dy, 5, 5);
	context.fillRect(this.x, this.y, 5, 5); 
	context.closePath();
	context.fill();	
}