var GameOver = {
    preload : function() {
        game.load.image('gameover', './assets/images/gameover.png');
        game.load.image('arrow', './assets/images/arrow.png');
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'gameover'); // add background
        arrow = this.add.sprite(300, 320, 'arrow');

        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.start, this);

        downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downButton.onDown.add(this.moveDown, this);

        upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upButton.onDown.add(this.moveUp, this);
    },

    moveDown : function() {
        if(arrow.y + 60 > 440){
            arrow.y = 320;
        }
        else{
            arrow.y += 60;
        }

        switch(arrow.y){
            case(320):
                arrow.x = 300;
                break;
            case(380):
                arrow.x = 295;
                break;
            case(440):
                arrow.x = 365;
                break;
            default:
                break;
        }
    },

    moveUp : function() {
        if(arrow.y - 60<320){
            arrow.y = 440;
        }
        else{
            arrow.y -= 60;
        }

        switch(arrow.y){
            case(320):
                arrow.x = 300;
                break;
            case(380):
                arrow.x = 295;
                break;
            case(440):
                arrow.x = 365;
                break;
            default:
                break;
        }
    },

    start : function() {
        // go to main menu, change the game state
        switch(arrow.y){
            case(320):
                this.state.start('Load');
                break;
            case(380):
                break;
            case(440):
                this.state.start('Menu');
                break;
            default:
                break;
        }
    }
};