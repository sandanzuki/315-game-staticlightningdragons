/*
 * Project Radical Quest
 * File: select.js
 *
 *  
 * -------------------------------------------------------------------------------- */
/* Comments here
 * button needs to talk to server to verify unit selection
 *
 */


// Testing
// -------------------------------------------------------------------------------- 
var background;

window.doOnClick = function() {
    background.visible =! background.visible;
}
// -------------------------------------------------------------------------------- 




var Select = {
    preload : function() {
        game.load.image('select', './assets/images/select.png'); // load image; call it 'select'
        game.load.image('button', './assets/images/button.png'); // load image; call it 'button'
        game.scale.pageAlignHorizontally = true; // align canvas
        game.scale.pageAlignVertically = true; // align canvas
        
    },

    create : function() {
        // this.add.sprite(0, 0, 'select'); // make 'select' a background 
        background = this.add.button(0, 0, 'select', this.toGame, this); // make 'button' a button
        //enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        //enterButton.onDown.add(this.startLoad, this);
        this.add.button(330, 50, 'button', doOnClick, this); // make 'button' a button
    },

    toGame : function() {
        this.state.start('Game'); // start the game and change the game state
    }
};
