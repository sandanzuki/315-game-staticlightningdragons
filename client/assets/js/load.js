/*
 * Project Radical Quest
 * File: load.js
 *
 *  
 * -------------------------------------------------------------------------------- */
/* Comments here
 * needs to talk to Server to verify unit selection
 *
 */




var Load = {
    preload : function() {
        game.load.image('load', './assets/images/load.png'); // load image; call it 'load'

        game.scale.pageAlignHorizontally = true; // aligns canvas
        game.scale.pageAlignVertically = true; // aligns canvas 
    },

    create : function() {
        this.add.sprite(0, 0, 'load'); // make 'load' a sprite background 

        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.N); // make 'N/n' key button 
        enterButton.onDown.add(this.toTutorial, this); // trigger next state 
    },

    toTutorial : function() {
        this.state.start('Tutorial'); // go to the next game state
    }
};
