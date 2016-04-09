/*
 * Project Radical Quest
 * File: menu.js
 *
 *  
 * -------------------------------------------------------------------------------- */
var Menu = {
    preload : function() {
        game.load.image('menu', './assets/images/menu.png');
        game.scale.pageAlignHorizontally = true; // aligns canvas
        game.scale.pageAlignVertically = true; // aligns canvas
    },


    create : function() {
        this.add.button(0, 0, 'menu', this.startLoad, this);
    },


    startLoad : function() {
        // start the game and change the game state
        this.state.start('Load');
    }
};
