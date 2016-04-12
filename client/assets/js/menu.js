var clang, intro_music; 




var Menu = {
    preload : function() {
        game.load.image('menu', './assets/images/menu.png');
        game.load.audio('clang', './assets/audio/soundeffects/clang.mp3');
        game.load.audio('intro', './assets/audio/music/intro.m4a');

        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'menu'); // add background

        clang = game.add.audio('clang');
        intro_music = game.add.audio('intro');
        intro_music.loopFull();

        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startLoad, this);
    },

    startLoad : function() {
        // start loading, change game state
        clang.play(); // sound effect upon keyboard press
        this.state.start('Load');
    }
};
