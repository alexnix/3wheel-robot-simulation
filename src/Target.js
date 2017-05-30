define([], function() {
	var Target = function(game, size) {
		this.x = game.width / 2;
		this.y = game.height / 2;
		this.dest_x = Math.round(Math.random() * game.width);
		this.dest_y = Math.round(Math.random() * game.height);
		this.path = [];
		this.game_width = game.width;
		this.game_height = game.height;
		this.size = size ? size : 5;
	}

	Target.prototype.display = function(context) {
		context.fillStyle = "#0000FF";
		context.fillRect(this.x, this.y, this.size, this.size); 
		context.fill();
	}

	Target.prototype.update = function() {
		if(this.x != this.dest_x) {
			this.x += this.x > this.dest_x ? -1 : 1;
		} else {
			this.dest_x = Math.round(Math.random() * this.game_width);
		}

		if(this.y != this.dest_y) {
			this.y += this.y > this.dest_y ? -1 : 1;
		} else {
			this.dest_y = Math.round(Math.random() * this.game_height);
		}
		this.path.push([this.x, this.y]);
	}

	Target.prototype.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}

	return Target;
});
