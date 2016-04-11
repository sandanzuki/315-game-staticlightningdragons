var background;

window.doOnClick = function() {
    background.visible =! background.visible;
}


var Select = {
    preload : function() {
        game.load.image('select', './assets/images/select.png');
        //game.load.image('button', './assets/images/button.png');
        
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
    },

    create : function() {
        // TODO GET RID OF THE BUTTONS. KEYBOARD ONLY NO EXCEPTIONS.
        // this.add.sprite(0, 0, 'select');
        //background = this.add.button(0, 0, 'select', this.toGame, this);
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startGame, this);
        //this.add.button(330, 50, 'button', doOnClick, this);
        //
        //
        //enterButton2.onDown.add(doOnClick, this);
    },

    startGame : function() {
        // start game, change game state
        this.state.start('Game');
    }
};
