define([], function(){
	return {
		init: function(options) {
			if(!options.canvas) {
				throw new Error('You need a canvas.');
			} else {
				options.canvas.addEventListener('touchstart', this.touchstartListener, false);
 				options.canvas.addEventListener('touchmove', this.touchmoveListener, false);
 				options.canvas.addEventListener('touchend', this.touchendListener, false);	
			}

			if(options.touchstartCallback) {
				this.touchStartCb = options.touchstartCallback;
			}

			if(options.touchMoveCollback) {
				this.touchMoveCb = options.touchMoveCollback;
			}

			if(options.touchEndCallback) {
				this.touchEndCb = options.touchEndCallback;
			}

			if(options.showTrace) {
				this.showTrace = true;
				this.ctx = options.canvas.getContext("2d");
			}
		},

		// Event callback setters

		setTouchStart: function(cb) {
			this.touchStartCb = cb;
		},

		setTouchMove: function(cb) {
			this.touchMoveCb = cb;
		},

		setTouchEnd: function(cb) {
			this.touchEndCb = cb;
		},

		// Event Listeners

		touchstartListener: function(event) {
			event.preventDefault();			
			if(this.touchStartCb) {
				this.touchStartCb();
			}

			if(this.showTrace) {
				this.ctx.fillRect(event.changedTouches[0].pageX,event.changedTouches[0].pageY,1,1);
			}

		},

		touchmoveListener: function(event){
			event.preventDefault();			
			if(this.touchMoveCb) {
				this.touchMoveCb();
			}

			if(this.showTrace) {
				this.ctx.fillRect(event.changedTouches[0].pageX,event.changedTouches[0].pageY,1,1);
			}

		},

		touchendListener: function(event){
			event.preventDefault();
			if(this.touchEndCb) {
				this.touchEndCb();
			}
		},
	}
});