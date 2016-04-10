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
        this.add.button(0, 0, 'load', this.toSelect, this); // make 'load' a button
    },

    toSelect : function() {
        this.state.start('Select'); // go to the next game state
    }
};
