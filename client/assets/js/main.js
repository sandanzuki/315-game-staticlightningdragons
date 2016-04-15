// declare and initialize game
var game = game || {};
game.win = true;
connection = new WebSocket("ws://pulse.bitwisehero.com:13337", "rqs");

game = new Phaser.Game(900, 600, Phaser.AUTO,'');


// states of game
game.state.add('Menu', Menu);
game.state.add('Load', Load);
game.state.add('Tutorial', Tutorial);
game.state.add('Select', Select);
game.state.add('Game', Game);
game.state.add('GameOver', GameOver);
game.state.start('Menu'); // start on 'Menu' state

