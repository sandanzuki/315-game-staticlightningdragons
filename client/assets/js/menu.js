var menu = {

    preload : function() {
        game.load.image('menu', './assets/images/menu.png');
    },

    create : function () {
        this.add.button(0, 0, 'menu', this.startGame, this);
    },

    startGame : function () {
        // start the game and change the game state
        this.state.start('InGame');
    }

};