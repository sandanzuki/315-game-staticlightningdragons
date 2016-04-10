var GameOver = {
    preload : function() {
        game.load.image('gameover', './assets/images/gameover.png');
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'gameover'); // add background

        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.restart, this);
    },

    start : function() {
        // go to main menu, change the game state
        this.state.start('Menu');
    }
};