/* 
 * This is a little artificial intelice
 * His name is Arnold like Arnold Schwarzenegger :D
 */

function ArnoldAI() {
    //alert('Hey! I am Arnold');
    this.game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
};

ArnoldAI.prototype.getData = function () {
    var self = this;
    console.log(self.game.grid.cells);
};

ArnoldAI.prototype.evaluate = function() {
    //Do something
    return 0;
};

ArnoldAI.prototype.go = function() {
    var dir = this.evaluate();
    this.game.move(dir);
};

$(document).ready(function () {
    var arnold = new ArnoldAI;
    $('#arnold-btn').on('click', function () {
        arnold.go();
    });
});



