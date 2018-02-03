/* 
 * This is a little artificial intelice
 * His name is Arnold like Arnold Schwarzenegger :D
 */

function ArnoldAI(nIndividuals) {
    console.log('Hey! I am Arnold');
    this.game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

    this.genetic = new GeneticAlgorithm();
    this.generation = this.genetic.createGeneration(nIndividuals);

    this.genSpan = $('#gen').find('span');
    this.generationSpan = $('#generation').find('span');
    
    this.nIndividuals = nIndividuals;
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
    if (dir === 0)
        this.moveStore.up++;
    else if (dir === 1)
        this.moveStore.right++;
    else if (dir === 2)
        this.moveStore.down++;
    else if (dir === 3)
        this.moveStore.left++;
};

ArnoldAI.prototype.checkStorageMove = function () {

    //  Penaliza los movimientos repetitivos
    if (this.moveStore.cont === this.moveStore.up)
        this.game.score = this.game.score / 151;
    else if (this.moveStore.cont === this.moveStore.right)
        this.game.score = this.game.score / 151;
    else if (this.moveStore.cont === this.moveStore.down)
        this.game.score = this.game.score / 151;
    else if (this.moveStore.cont === this.moveStore.left)
        this.game.score = this.game.score / 151;
    else
    {
        //  Premia a los que muevan en todas las direcciones
        if (this.moveStore.up > 0 && this.moveStore.right > 0 && this.moveStore.down > 0 && this.moveStore.left > 0)
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

    var network = new NeuralNetwork(gen);

    var tiles, copy, dir;

    do {

        tiles = this.getTiles();
        copy = this.makeCopy(tiles);

        dir = network.moveWhere(tiles);
        this.storageTheMove(dir);

        if (dir !== null)
            this.game.move(dir);
        else
            this.game.over = true;

        if (this.checkIfDontMove(copy))
            this.game.over = true;

    } while (!this.game.over && !this.game.won);

    this.game.actuate();    //Show the game over or congratulations    
    this.checkStorageMove();
    gen.best = this.game.score;

};

ArnoldAI.prototype.go = function () {

    var i = 0;
    var j = 0;

    do {

        i = 0;
        this.goodStore = 0;
        this.generationSpan.html(++j);

        do {

            this.game.restart();
            this.genSpan.html(i + 1);
            this.play(this.generation[i++]);

        } while (!this.game.won && i < this.nIndividuals);
        
        if(!this.game.won)
            this.generation = this.genetic.pair(this.generation);

    } while (!this.game.won);

    //  Congratulations!!!
    console.log(this.generation[i - 1]);

};

$(document).ready(function () {
    var arnold = new ArnoldAI(1000);
    console.log(arnold.generation[0]);
    $('#arnold-btn').on('click', function () {        
        arnold.go();        
    });
});



