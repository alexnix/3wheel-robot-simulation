define(["Network"], function(Network){
	var Neuroevolution = function(options){
		var self = this;
		self.options = {
			activation:function(a){
				ap = (-a)/1;
				return (1/(1 + Math.exp(ap)))
			},
			randomClamped:function(){
				return Math.random() * 2 - 1;
			},
			population:50,
			elitism:0.2,
			randomBehaviour:0.2,
			mutationRate:0.1,
			mutationRange:0.5,
			network:[1, [1], 1],
			historic:0,
			lowHistoric:false,
			scoreSort:-1,
			nbChild:1
		}

		self.set = function(options){
			for(var i in options){
				if(this.options[i] != undefined){
					self.options[i] = options[i];
				}
			}
		}

		self.set(options);

		//GENOM
		var Genome = function(score, network){
			this.score = score || 0;
			this.network = network || null;
		}
		//GENERATION
		var Generation = function(){
			this.genomes = [];
		}

		Generation.prototype.addGenome = function(genome){
			for(var i = 0; i < this.genomes.length; i++){
				if(self.options.scoreSort < 0){
					if(genome.score > this.genomes[i].score){
						break;
					}
				}else{
					if(genome.score < this.genomes[i].score){
						break;
					}
				}
				
			}
			this.genomes.splice(i, 0, genome);
		}

		Generation.prototype.breed = function(g1, g2, nbChilds){
			var datas = [];
			for(var nb = 0; nb < nbChilds; nb++){
				var data = JSON.parse(JSON.stringify(g1)); 
				for(var i in g2.network.weights){
					if(Math.random() <= 0.5){
						data.network.weights[i] = g2.network.weights[i];
					}
				}

				for(var i in data.network.weights){
					if(Math.random() <= self.options.mutationRate){
						data.network.weights[i] += Math.random() * self.options.mutationRange * 2 - self.options.mutationRange;
					}
				}
				datas.push(data);
			}

			return datas;
		}

		Generation.prototype.generateNextGeneration = function(){
			var nexts = [];

			for(var i = 0; i < Math.round(self.options.elitism * self.options.population); i++){
				if(nexts.length < self.options.population){
					nexts.push(JSON.parse(JSON.stringify(this.genomes[i].network)));
				}
			}

			for(var i = 0; i < Math.round(self.options.randomBehaviour * self.options.population); i++){
				var n = JSON.parse(JSON.stringify(this.genomes[0].network));
				for(var k in n.weights){
					n.weights[k] = self.options.randomClamped();
				}
				if(nexts.length < self.options.population){
					nexts.push(n);
				}
			}

			var max = 0;
			while(true){
				for(var i = 0; i < max; i++){
					var childs = this.breed(this.genomes[i], this.genomes[max], (self.options.nbChild > 0 ? self.options.nbChild : 1) );
					for(var c in childs){
						nexts.push(childs[c].network);
						if(nexts.length >= self.options.population){
							return nexts;
						}
					}
				}
				max++;
				if(max >= this.genomes.length - 1){
					max = 0;
				}
			}
		}
		//GENERATIONS
		var Generations = function(){
			this.generations = [];
			var currentGeneration = new Generation();
		}

		Generations.prototype.firstGeneration = function(input, hiddens, output){
			var out = [];
			for(var i = 0; i < self.options.population; i++){
				var nn = new Network(self.options);
				nn.perceptronGeneration(self.options.network[0], self.options.network[1], self.options.network[2]);
				out.push(nn.getSave());
			}
			this.generations.push(new Generation());
			return out;
		}

		Generations.prototype.nextGeneration = function(){
			if(this.generations.length == 0){
				return false;
			}

			var gen = this.generations[this.generations.length - 1].generateNextGeneration();
			this.generations.push(new Generation());
			return gen;
		}


		Generations.prototype.addGenome = function(genome){
			if(this.generations.length == 0){
				return false;
			}

			return this.generations[this.generations.length - 1].addGenome(genome);
		}


		//SELF METHODS
		self.generations = new Generations();

		self.restart = function(){
			self.generations = new Generations();
		}

		self.nextGeneration = function(){
			var networks = [];
			if(self.generations.generations.length == 0){
				networks = self.generations.firstGeneration();
			}else{
				networks = self.generations.nextGeneration();
			}
			var nns = [];
			for(var i in networks){
				var nn = new Network(self.options);
				nn.setSave(networks[i]);  
				nns.push(nn);
			}

			if(self.options.lowHistoric){
				if(self.generations.generations.length >= 2){
					var genomes = self.generations.generations[self.generations.generations.length  - 2].genomes;
					for(var i in genomes){
						delete genomes[i].network;
					}
				}
			}

			if(self.options.historic != -1){
				if(self.generations.generations.length > self.options.historic + 1){
					self.generations.generations.splice(0, self.generations.generations.length - (self.options.historic + 1));
				}
			}
			return nns;
		}

		self.networkScore = function(network, score){
			self.generations.addGenome(new Genome(score, network.getSave()));
		}
	}

	return Neuroevolution;
});
