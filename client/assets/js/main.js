/*
 * Project Radical Quest
 * File: main.js
 *
 *  
 * -------------------------------------------------------------------------------- */
/* Comments here
 *
 */




var game = game || {}; // declare var game

game = new Phaser.Game(900, 660, Phaser.AUTO,''); // Init instance of game

// how game states will be called
game.state.add('Menu', Menu); // add state Menu
game.state.add('Load', Load); // add state Load 
game.state.add('Tutorial', Tutorial); // add state Tutorial 
game.state.add('Select', Select); // add state Select 
game.state.add('Game', Game); // add state Game 
game.state.start('Menu'); // call Menu state first 
