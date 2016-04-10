var Tutorial = {
    preload : function() {
        game.load.image('tutorial', './assets/images/tutorial.png');
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        // flip between pages of tutorial
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        
        // skip tutorial
        escapeButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        escapeButton.onDown.add(this.startGame, this);
    },

    startGame : function() {
        // start game, change game state
        this.state.start('InGame');
    }
};