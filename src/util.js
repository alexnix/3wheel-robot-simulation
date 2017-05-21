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