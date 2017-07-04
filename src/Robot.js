define(['util'], function(Util){	

	var default_robot_move = function(f, robot) {
		robot.x += (f[0] > 0.5 ? 1 : -1);
		robot.y += (f[1] > 0.5 ? 1 : -1);
		// robot.path.push([this.x, this.y]);
	};

	var Robot = function(game, size) {
		this.x = game.width/2;
		this.y = game.height/2;
		this.theta = 1/2*Math.PI;
		this.score = 0;
		this.alive = true;
		this.steps = 0;
		this.path = [];
		this.size = size? size: 20;
		this.move = game.config.robot_move || default_robot_move;
	}

	Robot.prototype.isDead = function() {
		return this.steps ++== 1000;
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

	return Robot;
});
