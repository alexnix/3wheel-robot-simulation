define([], function(){
	var touchStartCb = null;
	var touchMoveCb = null;
	var touchEndCb = null;

	return {

		init: function(options) {
			if(!options.canvas) {
				throw new Error('You need a canvas for touch detector.');
			} else {
				options.canvas.addEventListener('touchstart', this.touchstartListener, false);
 				options.canvas.addEventListener('touchmove', this.touchmoveListener, false);
 				options.canvas.addEventListener('touchend', this.touchendListener, false);	
			}

			if(options.touchstartCallback) {
				touchStartCb = options.touchstartCallback;
			}

			if(options.touchMoveCollback) {
				touchMoveCb = options.touchMoveCollback;
			}

			if(options.touchEndCallback) {
				touchEndCb = options.touchEndCallback;
			}
		},

		// Event callback setters

		setTouchStart: function(cb) {
			touchStartCb = cb;
		},

		setTouchMove: function(cb) {
			touchMoveCb = cb;
		},

		setTouchEnd: function(cb) {
			touchEndCb = cb;
		},

		// Event Listeners

		touchstartListener: function(event) {	
			if(touchStartCb != null) {
				touchStartCb(event);
			}

			event.preventDefault();			
		},

		touchmoveListener: function(event){
			if(touchMoveCb != null) {
				touchMoveCb(event);
			}

			event.preventDefault();			
		},

		touchendListener: function(event){
			if(touchEndCb != null) {
				touchEndCb(event);
			}

			event.preventDefault();
		},
	}
});