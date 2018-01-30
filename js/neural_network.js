function NeuralNetwork() {
    console.log('Redes neuronales');
}

NeuralNetwork.prototype.sigmoid = function (x) {
    return 1/(1 + Math.exp(-x));
};

NeuralNetwork.prototype.normalizeValue = function(value) {
    if(value === null)
    {
        return 0;
    } else {
        return value / 1024;
    }
};

NeuralNetwork.prototype.neuron = function () {
    //Do something
};

