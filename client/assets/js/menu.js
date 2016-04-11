/*
 * Project Radical Quest
 * File: menu.js
 *
 *  
 * -------------------------------------------------------------------------------- */
/* Comments here
 *
 */




var Menu = {
    preload : function() {
        game.load.image('menu', './assets/images/menu.png'); // load image; call it 'menu'

        game.scale.pageAlignHorizontally = true; // aligns canvas
        game.scale.pageAlignVertically = true; // aligns canvas
    },

    create : function() {
        this.add.sprite(0, 0, 'menu'); // make 'menu' a sprite background 

        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.N); // make 'N/n' key button 
        enterButton.onDown.add(this.toLoad, this); // trigger next state 
    },

    toLoad : function() {
        this.state.start('Load'); // go to the next game state
    }
};
