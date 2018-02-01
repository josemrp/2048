/* 
 * This is a little artificial intelice
 * His name is Arnold like Arnold Schwarzenegger :D
 */

function ArnoldAI() {
    console.log('Hey! I am Arnold');
    this.game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
    this.isPlaying = false;
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

        if (self.game.over) {
            self.game.actuate();    //Show the game over
            self.isPlaying = false;
            clearInterval(loop);
        }

    }, 300);
};

ArnoldAI.prototype.go = function (generation) {

    /*
     * 5.-  Volver al (2) hasta llegar a 2048
     */
    var i = 0;
    var n = generation.length;

    this.play(generation[i]);                           //Do

    var self = this;
    var loop = setInterval(function () {

        if (!self.isPlaying) {
            generation[i].best = self.game.score;
            console.log(generation[i].best);
            i++;
            if (i < n) {                                //While
                self.game.restart();
                self.play(generation[i]);
            } else {
                clearInterval(loop);
                var genetic = new GeneticAlgorithm();
                var newGeneration = genetic.pair(generation);
                self.go(newGeneration);
            }

        }
    }, 1500);

};

$(document).ready(function () {
    var arnold = new ArnoldAI;
    $('#arnold-btn').on('click', function () {
        var genetic = new GeneticAlgorithm();
        var firstGeneration = genetic.createGeneration(10);
        arnold.go(firstGeneration);
    });
});



