/* 
 * This is a little artificial intelice
 * His name is Arnold like Arnold Schwarzenegger :D
 */

function ArnoldAI() {
    console.log('Hey! I am Arnold');
    this.game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);    
};

ArnoldAI.prototype.getTiles = function () {
    return this.game.grid.cells;
};

ArnoldAI.prototype.makeCopy = function(tiles) {
    var copy = []
    for(var i = 0; i < 4; i++) {
        copy[i] = []
        for(var j = 0; j < 4; j++) {
            if(tiles[i][j] === null)
                copy[i][j] = null;
            else
                copy[i][j] = tiles[i][j].value;
        }
    }
    return copy;
}; 

ArnoldAI.prototype.checkIfDontMove = function (oldTiles) {
    
    var newTitles = this.getTiles();
    
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            if(newTitles[i][j] === null && oldTiles[i][j] === null)
                continue;
            else if(newTitles[i][j] === null)
                return false;
            else if(oldTiles[i][j] === null)
                return false;                    
            else if(newTitles[i][j].value !== oldTiles[i][j]) {
                return false;
            }
        }
    }
    console.log('No move');
    return true;
};

ArnoldAI.prototype.play = function (gen) {
    
    var self = this;
    var tiles, copy, dir;
    var network = new NeuralNetwork(gen);
    
    do {
        tiles = self.getTiles();
        copy = self.makeCopy(tiles);
        
        dir = network.moveWhere(tiles);

        if (dir !== null)
            self.game.move(dir)
        else
            alert('No direction');

        if(self.checkIfDontMove(copy))
            self.game.over = true;
        
    } while( ! self.game.over);
    
    self.game.actuate();    //Show the game over

    /*var loop = setInterval(function () {

        var tiles = self.getTiles();
        var copy = self.makeCopy(tiles);
        
        var dir = network.moveWhere(tiles);

        if (dir !== null)
            self.game.move(dir)
        else
            alert('No direction');

        if(self.checkIfDontMove(copy))
            self.game.over = true;
        
        if (self.game.over) {
            self.game.actuate();    //Show the game over
            clearInterval(loop);
        }
        
    }, 400);*/
};

ArnoldAI.prototype.go = function () {
    
    /*
     * 1.-  Crear los primeros especimenes
     * 2.-  Probar y puntuar cada uno
     * 3.-  Clasificar
     * 4.-  Convinar mejores y mutar
     * 5.-  Volver al (2) hasta llegar a 2048
     */
    var genetic = new GeneticAlgorithm();
    var generation = genetic.createGeneration(50);
    
    this.play(generation[0]);
    
};

$(document).ready(function () {
    var arnold = new ArnoldAI;
    $('#arnold-btn').on('click', function () {
        arnold.go();
    });
});



