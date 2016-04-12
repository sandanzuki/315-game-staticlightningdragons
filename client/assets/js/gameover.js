var GameOver = {
    preload : function() {
        game.load.image('victory', './assets/images/victory.png');
        game.load.image('defeat', './assets/images/defeat.png');
        game.load.image('arrow_black', './assets/images/arrow_black.png');
        game.load.image('arrow_white', './assets/images/arrow_white.png');

        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        if(game.win){
            this.add.sprite(0, 0, 'victory'); // add background
            arrow = this.add.sprite(280, 305, 'arrow_black');
        }
        else{
            this.add.sprite(0, 0, 'defeat');
            arrow = this.add.sprite(280, 305, 'arrow_white');
        }
        
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.start, this);

        downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downButton.onDown.add(this.moveDown, this);

        upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upButton.onDown.add(this.moveUp, this);
    },

    moveDown : function() {
        if(arrow.y + 40 > 345)
            arrow.y = 305;
        else
            arrow.y += 40;
        switch(arrow.y){
            case(305):
                arrow.x = 280;
                break;
            case(345):
                arrow.x = 260;
                break;
            default:
                break;
        }
    },

    moveUp : function() {
        if(arrow.y - 40 < 305)
            arrow.y = 345;
        else
            arrow.y -= 40;
        switch(arrow.y){
            case(305):
                arrow.x = 280;
                break;
            case(345):
                arrow.x = 260;
                break;
            default:
                break;
        }
    },

    start : function() {
        switch(arrow.y){
            case(305):
                // load another game, change game state
                clang.play();  
                this.state.start('Load');
                break;
            case(345):
                // go to main menu, change game state
                clang.play();  
                this.state.start('Menu');
                break;
            default:
                break;
        }
    }
};
