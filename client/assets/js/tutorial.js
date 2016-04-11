/*
 * Project Radical Quest
 * File: tutorial.js
 *
 *  
 * -------------------------------------------------------------------------------- */
/* Comments here
 * needs to talk to Server to verify unit selection
 *
 */



// variables and helper functions
// -------------------------------------------------------------------------------- 
var layer, layer2, layer3, // layers of loaded images
    counter = 0; // counter to cycle thru images

// cycle to next image
window.nextLayer = function() { 
    if(counter == 0) { 
        layer.visible = !layer.visible;
    }
    if(counter == 1) { 
        layer2.visible = !layer2.visible;
    }
    counter++;
}

// cycle to prev image
window.prevLayer = function() { 
    if(counter == 1) {
        layer.visible = !layer.visible;
        counter=0;
    }
    if(counter >= 1) { 
        layer2.visible = !layer2.visible;
        counter=1;
    }
}


// main variable 
// -------------------------------------------------------------------------------- 
var Tutorial = {
    preload : function() {
        game.load.image('layer', './assets/images/tutorial.png'); // load image; call it 'load'
        game.load.image('layer2', './assets/images/tutorial_b.png'); // load image; call it 'load'
        game.load.image('layer3', './assets/images/tutorial_r.png'); // load image; call it 'load'
        //game.load.image('scare', './assets/images/button.png'); // load image; call it 'scare' 
        game.scale.pageAlignHorizontally = true; // aligns canvas
        game.scale.pageAlignVertically = true; // aligns canvas 
    },

    create : function() {
        // important! sprites must be declared this way.
        layer3 = this.add.sprite(0, 0, 'layer3'); // make 'select' a background 
        layer2 = this.add.sprite(0, 0, 'layer2'); // make 'select' a background 
        layer = this.add.button(0, 0, 'layer', this.toSelect, this); // make 'load' a button

        nextButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        prevButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        enterButton.onDown.add(this.toSelect, this);
        nextButton.onDown.add(nextLayer, this);
        prevButton.onDown.add(prevLayer, this);
    },

    toSelect : function() {
        this.state.start('Select'); // go to the next game state
    }
};
