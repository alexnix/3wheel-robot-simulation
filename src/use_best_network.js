define(['Network'], function(Network){
	var saved_generation_str = Android.restoreGeneration();

	if(saved_generation_str != '') {
		var saved_generation = JSON.parse(saved_generation_str);
		var best_genome = saved_generation[saved_generation.length - 1];
		var nn = new Network();
		nn.setSave(JSON.parse(best_genome.nn_str));
		nn.perceptronGeneration();
	} else {
		Android.noTrainedNetwork();
	}

	window.compute = function(x, y) {
		var out = nn.compute([x, y]);
		Android.move((out[0] > 0.5 ? 1 : -1), (out[1] > 0.5 ? 1 : -1));
 	}

});
