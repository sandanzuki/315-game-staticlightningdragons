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
        this.add.button(0, 0, 'menu', this.toLoad, this); // make 'menu' a button
    },

    toLoad : function() {
        this.state.start('Load'); // go to the next game state
    }
};
