/*
 * Project Radical Quest
 * File: load.js
 *
 *  
 * -------------------------------------------------------------------------------- */
var Load = {
    preload : function() {
        game.load.image('load', './assets/images/load.png');
        game.scale.pageAlignHorizontally = true; // aligns canvas
        game.scale.pageAlignVertically = true; // aligns canvas
    },


    create : function() {
        this.add.button(0, 0, 'load', this.startGame, this);
    },


    startGame : function() {
        // start the game and change the game state
        this.state.start('Game');
    }

};
