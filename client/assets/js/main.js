/*
 * Radical Quest
 * Authors
 *      - Chung, Eric
 *      - Dolifka, Randall
 *      - Fang, Jessica
 *      - Phelan, Alexander
 *
 *
 * File: main.js
 *
 *  
 * -------------------------------------------------------------------------------- */
var game = game || {};                              // Declare var game

game = new Phaser.Game(900, 660, Phaser.AUTO,'');   // Init instance of game

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality

game.state.add('Menu', Menu);                       // Add state Menu
game.state.add('Game', Game);                       // Add state Game 
game.state.start('Menu');                           // This state first 
