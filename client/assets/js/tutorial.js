var layer, layer2, layer3, // layers of loaded images
    counter = 0; // counter to cycle thru images

// cycle to next image
window.nextLayer = function() { 
    if(counter == 0)
        layer.visible = !layer.visible;
    if(counter == 1)
        layer2.visible = !layer2.visible;
    counter++;
}

// cycle to prev image
window.prevLayer = function() { 
    if(counter == 1) {
        layer.visible = !layer.visible;
        counter=0;
    }
    if(counter >= 1) { 
        layer2.visible = !layer2.visible;
        counter=1;
    }
}

var Tutorial = {
    preload : function() {
        // load images
        game.load.image('layer', './assets/images/tutorial.png'); 
        game.load.image('layer2', './assets/images/tutorial_b.png');
        game.load.image('layer3', './assets/images/tutorial_r.png');

        // align canvas
        game.scale.pageAlignHorizontally = true; 
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        // important! sprites must be declared in this order!
        layer3 = this.add.sprite(0, 0, 'layer3');
        layer2 = this.add.sprite(0, 0, 'layer2');
        layer = this.add.sprite(0, 0, 'layer');

        // flip between pages of tutorial
        nextButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        prevButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        nextButton.onDown.add(nextLayer, this);
        prevButton.onDown.add(prevLayer, this);
        
        // skip tutorial
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startSelect, this);
    },

    startSelect : function() {
        // start unit selection, change game state
        counter = 0;
        this.state.start('Username');
    }
};
