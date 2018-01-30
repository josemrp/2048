function GeneticAlgorithm() {
    console.log('Algoritmo genetico');
}

GeneticAlgorithm.prototype.createActivators = function(n) {
    var activator = [];
    for(var i = 0; i < n; i++) {
        activator[i] = Math.random();
    }
    return activator;
};

GeneticAlgorithm.prototype.createWeights = function(init, final) {
    var weigth = [];
    for(var i = 0; i < init; i++) {
        weigth[i] = [];
        for(var j = 0; j < final; j++) {
            weigth[i][j] = Math.random() < 0.5 ? Math.random() : Math.random() * -1;
        }
    }
    return weigth;
};

GeneticAlgorithm.prototype.createGen = function() {
    var gen = {
        weigths: [],
        activator: [],
        best: 0
    };
    
    gen.activator[0] = this.createActivators(5);
    gen.activator[1] = this.createActivators(5);
    gen.activator[2] = this.createActivators(4);
    
    gen.weigths[0] = this.createWeights(16, 5);
    gen.weigths[1] = this.createWeights(5, 5);
    gen.weigths[2] = this.createWeights(5, 4);
    
    return gen;
};

GeneticAlgorithm.prototype.createGeneration = function(n) {
    var generation = [];
    for(var i = 0; i < n; i++) {
        generation[i] = this.createGen();
    }
    return generation;
};
