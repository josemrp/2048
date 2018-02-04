function GeneticAlgorithm() {
    //console.log('Algoritmo genetico');
    this.cap = 3;
    this.act = 14;
};

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
            //weigth[i][j] = Math.random() < 0.5 ? Math.random() : Math.random() * -1;
            weigth[i][j] = Math.random();
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

    gen.weigths[0] = this.createWeights(16, this.act);
    for(var i = 0; i < this.cap; i++)
    {
        gen.activators[i] = this.createActivators(this.act);
        if(i > 0)
            gen.weigths[i] = this.createWeights(this.act, this.act);
    }
    gen.activators[i] = this.createActivators(2);
    gen.weigths[i] = this.createWeights(this.act, 2);
    
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
    
    var keepScore = generation[0].best;
    console.log('The best of past generation do: ' + keepScore);
    return generation;
};

GeneticAlgorithm.prototype.pairGen = function (parents) {
    var gen = {
        weigths: [],
        activators: [],
        best: 0
    };
    
    gen.weigths[0] = this.pairWeights(16, this.act, parents, 0);
    for(var i = 0; i < this.cap; i++)
    {
        gen.activators[i] = this.pairActivators(this.act, parents, i);
        if(i > 0)
            gen.weigths[i] = this.pairWeights(this.act, this.act, parents, i);
    }
    gen.activators[i] = this.pairActivators(2, parents, i);
    gen.weigths[i] = this.pairWeights(this.act, 2, parents, i);

    return gen;
};

GeneticAlgorithm.prototype.pairTheBest = function (generation) {

    var newGeneration = [];
    var nGenes = generation.length;
    var survivalRange = nGenes * 0.05;
    var survivalParents = survivalRange * 0.2;                  //Save the best of the best
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

GeneticAlgorithm.prototype.mutate = function (generation) {

    var nGenes = generation.length;
    var survivalParents = Math.floor(nGenes * 0.01); 
    var numMutations = ((this.act * this.act * this.cap) + (this.act * this.cap)) * 0.2;
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
                
                //generation[i].weigths[cap][iWeigth][jWeigth] = Math.random() < 0.5 ? Math.random() : Math.random() * -1;
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

    return generation;
};

GeneticAlgorithm.prototype.pair = function (generation) {
    
    var newGeneration;
    
    newGeneration = this.sortGens(generation);
    newGeneration = this.pairTheBest(newGeneration);
    newGeneration = this.mutate(newGeneration);

    return newGeneration;
};
