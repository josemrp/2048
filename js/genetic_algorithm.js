function GeneticAlgorithm() {
    //console.log('Algoritmo genetico');
}

GeneticAlgorithm.prototype.createActivators = function (n) {
    var activator = [];
    for (var i = 0; i < n; i++) {
        activator[i] = Math.random();
    }
    return activator;
};

GeneticAlgorithm.prototype.pairActivators = function (n, parents, cap) {
    var activator = [];
    var nParents = parents.length - 1;
    var child;
    for (var i = 0; i < n; i++) {
        child = Math.floor(Math.random() * nParents);
        activator[i] = parents[child].activators[cap][i];
    }
    return activator;
};

GeneticAlgorithm.prototype.createWeights = function (init, final) {
    var weigth = [];
    for (var i = 0; i < init; i++) {
        weigth[i] = [];
        for (var j = 0; j < final; j++) {
            //weigth[i][j] = Math.random() < 0.5 ? Math.random() : Math.random() * -1;
            weigth[i][j] = Math.random();
        }
    }
    return weigth;
};

GeneticAlgorithm.prototype.pairWeights = function (init, final, parents, cap) {

    var weigth = [];
    var nParents = parents.length - 1;
    var child;

    for (var i = 0; i < init; i++) {
        weigth[i] = [];
        for (var j = 0; j < final; j++) {
            child = Math.floor(Math.random() * nParents);
            weigth[i][j] = parents[child].weigths[cap][i][j];
        }
    }

    return weigth;
};

GeneticAlgorithm.prototype.createGen = function () {
    var gen = {
        weigths: [],
        activators: [],
        best: 0
    };

    gen.activators[0] = this.createActivators(5);
    gen.activators[1] = this.createActivators(5);
    gen.activators[2] = this.createActivators(4);

    gen.weigths[0] = this.createWeights(16, 5);
    gen.weigths[1] = this.createWeights(5, 5);
    gen.weigths[2] = this.createWeights(5, 4);

    return gen;
};

GeneticAlgorithm.prototype.createGeneration = function (n) {
    var generation = [];
    for (var i = 0; i < n; i++) {
        generation[i] = this.createGen();
    }
    return generation;
};

GeneticAlgorithm.prototype.sortGens = function (generation) {

    //Sort in JS 
    generation.sort(function (a, b) {
        return parseFloat(b.best) - parseFloat(a.best);
    });

    return generation;
};

GeneticAlgorithm.prototype.pairGen = function (parents) {
    var gen = {
        weigths: [],
        activators: [],
        best: 0
    };

    gen.activators[0] = this.pairActivators(5, parents, 0);
    gen.activators[1] = this.pairActivators(5, parents, 1);
    gen.activators[2] = this.pairActivators(4, parents, 2);

    gen.weigths[0] = this.pairWeights(16, 5, parents, 0);
    gen.weigths[1] = this.pairWeights(5, 5, parents, 1);
    gen.weigths[2] = this.pairWeights(5, 4, parents, 2);

    return gen;
}

GeneticAlgorithm.prototype.pairTheBest = function (generation) {

    var newGeneration = [];
    var n = generation.length;
    var bestGens = [];

    for (var i = 0; i < n / 3; i++)
        bestGens[i] = generation[i];

    for (var j = 0; j < n; j++) {
        newGeneration[j] = this.pairGen(bestGens);
    }

    return newGeneration;
};

GeneticAlgorithm.prototype.mutate = function (generation, numMutations) {

    var newGeneration = [];
    var n = generation.length;
    var fork;
    var cap;
    var iActivator;
    var iWeigth;
    var jWeigth;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < numMutations; j++) {
            
            fork = Math.random() < 0.8 ? true : false;
            //weigth
            if (fork) {
                
                cap = Math.floor(Math.random() * generation[i].weigths.length);
                iWeigth = Math.floor(Math.random() * generation[i].weigths[cap].length);
                jWeigth = Math.floor(Math.random() * generation[i].weigths[cap][iWeigth].length);
                
                generation[i].weigths[cap][iWeigth][jWeigth] = Math.random();
            }
            //activator
            else {
                
                cap = Math.floor(Math.random() * generation[i].activators.length);
                iActivator = Math.floor(Math.random() * generation[i].activators[cap].length);
                
                generation[i].activators[cap][iActivator] = Math.random();
            }
        }
    }

    return newGeneration = generation;
};

GeneticAlgorithm.prototype.pair = function (generation) {
    
    var newGeneration;
    
    newGeneration = this.sortGens(generation);
    newGeneration = this.pairTheBest(newGeneration);
    newGeneration = this.mutate(newGeneration, 5);

    return newGeneration;
};
