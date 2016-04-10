var Menu = {
    preload : function() {
        game.load.image('menu', './assets/images/menu.png');
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startLoad, this);
    },

    startLoad : function() {
        // start game, change game state
        this.state.start('Load');
    }
};