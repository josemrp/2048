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
    var nParents = parents.length;
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
            weigth[i][j] = Math.random() < 0.5 ? Math.random() : Math.random() * -1;
            //weigth[i][j] = Math.random();
        }
    }
    return weigth;
};

GeneticAlgorithm.prototype.pairWeights = function (init, final, parents, cap) {

    var weigth = [];
    var nParents = parents.length;
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

    gen.activators[0] = this.createActivators(8);
    gen.activators[1] = this.createActivators(8);
    gen.activators[2] = this.createActivators(2);
    //gen.activators[3] = this.createActivators(2);

    gen.weigths[0] = this.createWeights(16, 8);
    gen.weigths[1] = this.createWeights(8, 8);
    gen.weigths[2] = this.createWeights(8, 2);
    //gen.weigths[3] = this.createWeights(4, 2);

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

    console.log(generation[0].best) //Shows the best of each generation
    return generation;
};

GeneticAlgorithm.prototype.pairGen = function (parents) {
    var gen = {
        weigths: [],
        activators: [],
        best: 0
    };

    gen.activators[0] = this.pairActivators(8, parents, 0);
    gen.activators[1] = this.pairActivators(8, parents, 1);
    gen.activators[2] = this.pairActivators(2, parents, 2);
    //gen.activators[3] = this.pairActivators(2, parents, 3);

    gen.weigths[0] = this.pairWeights(16, 8, parents, 0);
    gen.weigths[1] = this.pairWeights(8, 8, parents, 1);
    gen.weigths[2] = this.pairWeights(8, 2, parents, 2);
    //gen.weigths[3] = this.pairWeights(4, 2, parents, 3);

    return gen;
}

GeneticAlgorithm.prototype.pairTheBest = function (generation) {

    var newGeneration = [];
    var nGenes = generation.length;
    var survivalRange = nGenes / 3;
    var survivalParents = survivalRange / 9;                  //Save the best of the best
    var bestGens = [];

    for (var i = 0; i < survivalRange; i++)
        bestGens[i] = generation[i];

    for (var j = 0; j < nGenes; j++) {
        if(j < survivalParents)
            newGeneration[j] = generation[j];
        else
            newGeneration[j] = this.pairGen(bestGens);
    }

    return newGeneration;
};

GeneticAlgorithm.prototype.mutate = function (generation, numMutations) {

    var nGenes = generation.length;
    var survivalParents = Math.floor(nGenes / 27); 
    var fork;
    var cap;
    var iActivator;
    var iWeigth;
    var jWeigth;

    for (var i = survivalParents; i < nGenes; i++) {
        for (var j = 0; j < numMutations; j++) {
            
            fork = Math.random() < 0.8 ? true : false;
            //weigth
            if (fork) {
                
                cap = Math.floor(Math.random() * generation[i].weigths.length);
                iWeigth = Math.floor(Math.random() * generation[i].weigths[cap].length);
                jWeigth = Math.floor(Math.random() * generation[i].weigths[cap][iWeigth].length);
                
                generation[i].weigths[cap][iWeigth][jWeigth] = Math.random() < 0.5 ? Math.random() : Math.random() * -1;
                //generation[i].weigths[cap][iWeigth][jWeigth] = Math.random();
            }
            //activator
            else {
                
                cap = Math.floor(Math.random() * generation[i].activators.length);
                iActivator = Math.floor(Math.random() * generation[i].activators[cap].length);
                
                generation[i].activators[cap][iActivator] = Math.random();
            }
        }
    }

    return generation;
};

GeneticAlgorithm.prototype.pair = function (generation) {
    
    var newGeneration;
    
    newGeneration = this.sortGens(generation);
    newGeneration = this.pairTheBest(newGeneration);
    newGeneration = this.mutate(newGeneration, 30);

    return newGeneration;
};
