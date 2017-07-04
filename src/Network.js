define([], function(){
	var options = {
		activation:function(a){
			ap = (-a)/1;
			return (1/(1 + Math.exp(ap)))
		},
		randomClamped:function(){
			return Math.random() * 2 - 1;
		}
	};
	
	//NEURON
	var Neuron = function(){
		this.value = 0;
		this.weights = [];
	}
	Neuron.prototype.populate = function(nb){
		this.weights = [];
		for(var i = 0; i < nb; i++){
			this.weights.push(options.randomClamped());
		}
	}
	//LAYER
	var Layer = function(index){
		this.id = index || 0;
		this.neurons = [];
	}
	Layer.prototype.populate = function(nbNeurons, nbInputs){
		this.neurons = [];
		for(var i = 0; i < nbNeurons; i++){
			var n = new Neuron();
			n.populate(nbInputs);
			this.neurons.push(n);
		}
	}
	//NETWORK
	var Network = function(myOptions){
		this.layers = [];
		Object.assign(options, myOptions);
	}

	Network.prototype.perceptronGeneration = function(input, hiddens, output){
		var index = 0;
		var previousNeurons = 0;
		var layer = new Layer(index);
		layer.populate(input, previousNeurons);
		previousNeurons = input;
		this.layers.push(layer);
		index++;
		for(var i in hiddens){
			var layer = new Layer(index);
			layer.populate(hiddens[i], previousNeurons);
			previousNeurons = hiddens[i];
			this.layers.push(layer);
			index++;
		}
		var layer = new Layer(index);
		layer.populate(output, previousNeurons);
		this.layers.push(layer);
	}


	Network.prototype.getSave = function(){
		var datas = {
			neurons:[],
			weights:[]
		};
		for(var i in this.layers){
			datas.neurons.push(this.layers[i].neurons.length);
			for(var j in this.layers[i].neurons){
				for(var k in this.layers[i].neurons[j].weights){
					datas.weights.push(this.layers[i].neurons[j].weights[k]);
				}
			}
		}
		return datas;
	}


	Network.prototype.setSave = function(save){
		var previousNeurons = 0;
		var index = 0;
		var indexWeights = 0;
		this.layers = [];
		for(var i in save.neurons){
			var layer = new Layer(index);
			layer.populate(save.neurons[i], previousNeurons);
			for(var j in layer.neurons){
				for(var k in layer.neurons[j].weights){
					layer.neurons[j].weights[k] = save.weights[indexWeights];
					indexWeights++;
				}
			}
			previousNeurons = save.neurons[i];
			index++;
			this.layers.push(layer);
		}
	}

	Network.prototype.compute = function(inputs){
		for(var i in inputs){
			if(this.layers[0] && this.layers[0].neurons[i]){
				this.layers[0].neurons[i].value = inputs[i];
			}
		}

		var prevLayer = this.layers[0];
		for(var i = 1; i < this.layers.length; i++){
			for(var j in this.layers[i].neurons){
				var sum = 0;
				for(var k in prevLayer.neurons){
					sum += prevLayer.neurons[k].value * this.layers[i].neurons[j].weights[k];
				}
				this.layers[i].neurons[j].value = options.activation(sum);
			}
			prevLayer = this.layers[i];
		} 

		var out = [];
		var lastLayer = this.layers[this.layers.length - 1];
		for(var i in lastLayer.neurons){
			out.push(lastLayer.neurons[i].value);
		}

		return out;
	}

	return Network;
})