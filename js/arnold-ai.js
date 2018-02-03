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
    this.goodStore = 0;
    
    this.moveStore = {
        cont: 0,
        up: 0,
        down: 0,
        right: 0,
        left: 0
    };
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

ArnoldAI.prototype.storageTheMove = function (dir) {
    this.moveStore.cont++;
    if(dir === 0)
        this.moveStore.up++;
    else if(dir === 1)
        this.moveStore.right++;
    else if(dir === 2)
        this.moveStore.down++;
    else if(dir === 3)
        this.moveStore.left++;
};

ArnoldAI.prototype.checkStorageMove = function () {
    
    //  Penaliza los movimientos repetitivos
    if(this.moveStore.cont === this.moveStore.up)
        this.game.score = this.game.score / 151;
    else if(this.moveStore.cont === this.moveStore.right)
        this.game.score = this.game.score / 151;
    else if(this.moveStore.cont === this.moveStore.down)
        this.game.score = this.game.score / 151;
    else if(this.moveStore.cont === this.moveStore.left)
        this.game.score = this.game.score / 151;
    else
    {
        //  Premia a los que muevan en todas las direcciones
        if(this.moveStore.up > 0 && this.moveStore.right > 0 && this.moveStore.down > 0 && this.moveStore.left > 0)
            this.game.score = this.game.score * 10;
        this.goodStore++;
        console.log('Eureka: ' + this.goodStore + ' -> ' + this.game.score);
    }
    
    this.moveStore = {
        cont: 0,
        up: 0,
        down: 0,
        right: 0,
        left: 0
    };
};

ArnoldAI.prototype.play = function (gen) {

    this.isPlaying = true;
    var self = this;
    var network = new NeuralNetwork(gen);

    var loop = setInterval(function () {

        var tiles = self.getTiles();
        var copy = self.makeCopy(tiles);

        var dir = network.moveWhere(tiles);
        self.storageTheMove(dir);

        if (dir !== null)
            self.game.move(dir);
        else
            self.game.over = true;

        if (self.checkIfDontMove(copy))
            self.game.over = true;

        if (self.game.over || self.game.won) {

            clearInterval(loop);
            self.game.actuate();    //Show the game over or congratulations
            self.isPlaying = false;

        }

    }, 350);
};

ArnoldAI.prototype.go = function (generation) {

    var i = 0;
    var n = generation.length;
    
    console.log(generation[i]);

    this.play(generation[i]);                           //Do

    var self = this;
    var loop = setInterval(function () {
        
        self.genSpan.html(i + 1);

        if (!self.isPlaying) {

            //Congratulations, you are the best
            if(self.game.won) {
                clearInterval(loop); 
                return;
            }               

            self.checkStorageMove();  //Penalizacion
            generation[i].best = self.game.score;
            i++;

            if (i < n) {                                //While

                self.game.restart();
                self.play(generation[i]);

            } else {
                
                clearInterval(loop); 

                if (!self.game.won) {
                    
                    var genetic = new GeneticAlgorithm();
                    var newGeneration = genetic.pair(generation);
                    self.generationSpan.html(++self.generationCounter);
                    
                    self.go(newGeneration);
                    
                }


            }

        }
    }, 700);

};

$(document).ready(function () {
    var arnold = new ArnoldAI;
    $('#arnold-btn').on('click', function () {
        var genetic = new GeneticAlgorithm();
        var firstGeneration = genetic.createGeneration(1000);
        arnold.go(firstGeneration);
    });
});



