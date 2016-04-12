var Select = {
    preload : function() {
        game.load.image('select', './assets/images/select.png');
        
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
    },

    create : function() {
        this.add.sprite(0, 0, 'select');
        
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startGame, this);
    },

    startGame : function() {
        // start game, change game state
        this.state.start('Game');
    }
};