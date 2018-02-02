function NeuralNetwork(gen) {
    this.gen = gen;
};

NeuralNetwork.prototype.sigmoid = function (x) {
    return 1/(1 + Math.exp(-x));
};

NeuralNetwork.prototype.normalizeValue = function(tile) {
    if(tile === null)
    {
        return 0;
    } else {
        return tile.value / 1024;
    }
};

NeuralNetwork.prototype.sortTiles = function(tiles) {
    var sort = [];
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
            sort.push(tiles[i][j]);
    return sort;
};

NeuralNetwork.prototype.neuron = function (cap, j) {
    
    var k = cap - 1;
    if(k === -1)
        return this.normalizeValue(this.tiles[j]);
    
    //Toma la cantidad de activadores de la capa anterior o en su defecto el numero de parametros de entrada
    var n = k > 0 ? this.gen.activators[k - 1].length : this.tiles.length;
    var ac = 0;
    
    for(var i = 0; i < n; i++) {
        ac += this.neuron(k, i) * this.gen.weigths[k][i][j];
    }
    
    if(this.sigmoid(ac) > this.gen.activators[k][j])
        return 1;
    else
        return 0;
    
};

NeuralNetwork.prototype.moveWhere = function (tiles) {
    
    this.tiles = this.sortTiles(tiles);
    
    // 0: vertical, 1: horizontal
    var orientation = this.neuron(3, 0);
    
    // 0: negative, 1: positive
    var meaning = this.neuron(3, 1);
    
    if(orientation === 0) {
        if(meaning === 1) {
            return 0;   //up
        } else {
            return 2;   //down
        }
    } else {
        if(meaning === 1) {
            return 1;   //right
        } else {
            return 3;   //left
        }
        
    }
    
    /*
    // 0: up, 1: right, 2: down, 3: left
    for(var i = 0; i < 4; i++)
        if(this.neuron(3, i) === 1)
            return i;
    */
    //Tendrá preferencia de mover hacia arriba, deberia penalizar el hecho de varias opciones multiples
    return null;
};

