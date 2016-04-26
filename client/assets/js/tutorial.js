var layer, layer2, layer3,// layers of loaded images
    tutorial_counter = 0; // tutorial_counter to cycle thru images

var Tutorial = {
    preload : function() {
        // load images
        game.load.image('layer', './assets/images/tutorial1.png'); 
        game.load.image('layer2', './assets/images/tutorial2.png');

        // align canvas
        game.scale.pageAlignHorizontally = true; 
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        // important! sprites must be declared in this order!
        layer2 = this.add.sprite(0, 0, 'layer2');
        layer = this.add.sprite(0, 0, 'layer');

        // flip between pages of tutorial
        nextButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        prevButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        nextButton.onDown.add(this.nextLayer, this);
        prevButton.onDown.add(this.prevLayer, this);
        
        // skip tutorial
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startSelect, this);
    },

    // cycle to next image
    nextLayer : function() { 
        if(tutorial_counter == 0)
            layer.visible = !layer.visible;
        tutorial_counter = 1;
    },

    // cycle to prev image
    prevLayer : function() { 
        if(tutorial_counter == 1)
            layer.visible = !layer.visible;
        tutorial_counter = 0;
    },

    startSelect : function() {
        // start unit selection, change game state
        tutorial_counter = 0;
        this.state.start('Username');
    }
};