requirejs(['Network'], function(Network){
	var saved_generation_str = Android.restoreGeneration();
	
	if(saved_generation_str != '') {
		var saved_generation = JSON.parse(saved_generation_str);
		var best_genome = saved_generation[Android.getBest()];
		var nn = new Network();
		nn.setSave(JSON.parse(best_genome.nn_str));
	} else {
		Android.noTrainedNetwork();
	}

	window.compute = function(x, y) {
		var out = nn.compute([x, y]);
		Android.move((out[0] > 0.5 ? 1 : -1), (out[1] > 0.5 ? 1 : -1));
 	}

});