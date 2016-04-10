// declare and initialize game
var game = game || {};
game = new Phaser.Game(900, 660, Phaser.AUTO,'');


// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality

// states of game
game.state.add('Menu', Menu);
game.state.add('Load', Load);
game.state.add('Tutorial', Tutorial);
game.state.add('InGame', Game);
game.state.add('GameOver', GameOver);
game.state.start('Menu'); // start on 'Menu' state