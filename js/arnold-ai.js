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

ArnoldAI.prototype.play = function(gen) {
    /*
     * 1.-  Tomar el gen
     * 2.-  Tomar los valores actuales de las celdas
     * 3.-  Crear la red neuronal con los genes actuales
     * 3.-  Jugar con este gen, actualizar tablero de vez en cuando
     */
    var best = 0;
    var network = new NeuralNetwork(gen);
    
    //Ciclo para cada movimiento hasta el game over
    var tiles = this.getTiles();
    
    var dir = network.moveWhere(tiles);
    console.log(dir);
    
    if(dir !== null)
        this.game.move(dir)
    else
        alert('No direction');
    //Hasta el game over
    return best;    
};

ArnoldAI.prototype.go = function() {
    
    /*
     * 1.-  Crear los primeros especimenes
     * 2.-  Probar y puntuar cada uno
     * 3.-  Clasificar
     * 4.-  Convinar mejores y mutar
     * 5.-  Volver al (2) hasta llegar a 2048
     */
    var genetic = new GeneticAlgorithm();
    var generation = genetic.createGeneration(50);
    
    //Ciclo grande para cada gen
    var best = this.play(generation[0]);
};

$(document).ready(function () {
    var arnold = new ArnoldAI;
    $('#arnold-btn').on('click', function () {
        arnold.go();
    });
});



