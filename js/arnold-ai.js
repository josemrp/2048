/* 
 * This is a little artificial intelice
 * His name is Arnold like Arnold Schwarzenegger :D
 */

function ArnoldAI() {
    console.log('Hey! I am Arnold');
    this.game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
    this.isPlaying = false;
    this.genSpan = $('#gen').find('span');
    this.generationSpan = $('#generation').find('span');
    this.generationCounter = 1;
}
;

ArnoldAI.prototype.getTiles = function () {
    return this.game.grid.cells;
};

ArnoldAI.prototype.makeCopy = function (tiles) {
    var copy = []
    for (var i = 0; i < 4; i++) {
        copy[i] = []
        for (var j = 0; j < 4; j++) {
            if (tiles[i][j] === null)
                copy[i][j] = null;
            else
                copy[i][j] = tiles[i][j].value;
        }
    }
    return copy;
};

ArnoldAI.prototype.checkIfDontMove = function (oldTiles) {

    var newTitles = this.getTiles();

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (newTitles[i][j] === null && oldTiles[i][j] === null)
                continue;
            else if (newTitles[i][j] === null)
                return false;
            else if (oldTiles[i][j] === null)
                return false;
            else if (newTitles[i][j].value !== oldTiles[i][j]) {
                return false;
            }
        }
    }

    return true;
};

ArnoldAI.prototype.play = function (gen) {

    this.isPlaying = true;
    var self = this;
    var network = new NeuralNetwork(gen);

    var loop = setInterval(function () {

        var tiles = self.getTiles();
        var copy = self.makeCopy(tiles);

        var dir = network.moveWhere(tiles);

        if (dir !== null)
            self.game.move(dir)
        else
            self.game.over = true;

        if (self.checkIfDontMove(copy))
            self.game.over = true;

        if (self.game.over || self.game.won) {

            clearInterval(loop);
            self.game.actuate();    //Show the game over or congratulations
            self.isPlaying = false;

        }

    }, 200);
};

ArnoldAI.prototype.go = function (generation) {

    var i = 0;
    var n = generation.length;

    this.play(generation[i]);                           //Do

    var self = this;
    var loop = setInterval(function () {

        var count = i;
        self.genSpan.html(count + 1);

        if (!self.isPlaying) {

            //Congratulations, you are the best
            if(self.game.won)
                clearInterval(loop);                

            generation[i].best = self.game.score;
            console.log(i);
            i++;

            if (i < n) {                                //While

                self.game.restart();
                self.play(generation[i]);

            } else {

                if (!self.game.won) {
                    
                    clearInterval(loop); 
                    
                    var genetic = new GeneticAlgorithm();
                    var newGeneration = genetic.pair(generation);
                    self.generationSpan.html(++self.generationCounter);
                    
                    self.go(newGeneration);
                    
                }


            }

        }
    }, 1000);

};

$(document).ready(function () {
    var arnold = new ArnoldAI;
    $('#arnold-btn').on('click', function () {
        var genetic = new GeneticAlgorithm();
        var firstGeneration = genetic.createGeneration(100);
        arnold.go(firstGeneration);
    });
});



