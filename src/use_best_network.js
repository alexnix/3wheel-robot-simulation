define(['Network'], function(Network){

	var saved_generation_str;
	try{	
		saved_generation_str = Android.restoreGeneration();
		if(saved_generation_str != '') {
			var saved_generation = JSON.parse(saved_generation_str);
			var best_genome = saved_generation[saved_generation.length - 1];
			var nn = new Network();
			nn.setSave(JSON.parse(best_genome.nn_str));
			nn.perceptronGeneration();
		} else {
			Android.noTrainedNetwork();
		}
	} catch(e) {

		var nn = new Network();
		nn.setSave({"neurons":[2,4],"weights":[1.3662415657488158,-0.5071309598693996,-0.7834671230442884,-0.3727432342696102,0.09768074657504977,0.5301265138357516,0.01595213629434511,-0.7411071676904253]});
		nn.perceptronGeneration();
			console.log(nn);
		nn.layers.splice(2, 2);

		console.log( nn.compute([3, 3]) ) ;
	}


	window.compute = function(x, y) {
		var out = nn.compute([x, y]);
		Android.move((out[0] > 0.5 ? 1 : -1), (out[1] > 0.5 ? 1 : -1));
 	}

 	window.compute_test = function(x, y) {
		var out = nn.compute([x, y]);
		return out;
 	}


});
