var cursor,
    oldX, oldY;

var position = "up";

var index;
var symbols=[];

var Select = {
    preload : function() {
        game.load.image('select', './assets/images/select.png');
        game.load.image('fighter', './assets/images/fighter_symbol.png');
        game.load.image('archer', './assets/images/archer_symbol.png');
        game.load.image('mage', './assets/images/mage_symbol.png');
        game.load.image('healer', './assets/images/healer_symbol.png');

        
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'select');
        cursor = game.add.graphics();
        cursor.lineStyle(2, 0x00ff00, 1);
        cursor.drawRect(0, 0, 86, 86);
        cursor.x = 76;
        cursor.y = 196;
        
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startGame, this);

        upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upButton.onDown.add(this.cursorUp, this);

        downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downButton.onDown.add(this.cursorDown, this);

        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftButton.onDown.add(this.cursorLeft, this);

        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightButton.onDown.add(this.cursorRight, this);
    },

    symbolLocation : function(oldX) {
        switch(oldX){
            case(76):
                index = 1;
                break;
            case(244):
                index = 2;
                break;
            case(412):
                index = 3;
                break;
            case(580):
                index = 4;
                break;
            case(748):
                index = 5;
                break;
            default:
                break;
        }
    },

    startGame : function() {
        // start game, change game state
        //intro_music.destroy();  
        //game.cache.removeSound('intro');
        //this.state.start('Game');
        if(position == "up"){
            if(cursor.y == 530){
                window.alert(symbols.length);
                if(symbols.length == 6)
                    this.state.start('Game');
            }
            else{
                this.symbolLocation(cursor.x);
                if(symbols[index]){
                    symbols[index].destroy();
                    symbols.splice(index, 1);
                }
                else{
                    cursor.clear();
                    position = "down";
                    oldX = cursor.x;
                    oldY = cursor.y;

                    cursor.lineStyle(2, 0x00ff00, 1);
                    cursor.drawRect(0, 0, 70, 70);

                    cursor.x = 169;
                    cursor.y = 409;
                }
            }
        }
        else if (position == "down"){
            cursor.clear();
            position = "up";
            cursor.lineStyle(2, 0x00ff00, 1);
            cursor.drawRect(0, 0, 86, 86);
            this.symbolLocation(oldX);

            switch(cursor.x){
                case(169):
                    symbols[index] = this.add.sprite(oldX, oldY, 'mage');
                    break;
                case(337):
                    symbols[index] = this.add.sprite(oldX, oldY, 'archer');
                    break;
                case(505):
                    symbols[index] = this.add.sprite(oldX, oldY, 'fighter');
                    break;
                case(673):
                    symbols[index] = this.add.sprite(oldX, oldY, 'healer');
                    break;
                default:
                    break;
            }

            cursor.x = oldX;
            cursor.y = oldY;
        }
    },

    cursorLeft : function() {
        if(cursor.y != 530){
            if(position == "up"){
                if(cursor.x - 168 < 76)
                    cursor.x = 748;
                else
                    cursor.x -= 168;
            }
            else{
                if(cursor.x - 168 < 169)
                    cursor.x = 673;
                else
                    cursor.x -= 168;
            }
        }
    },

    cursorRight : function() {
        if(cursor.y != 530){
            if(position == "up"){
                if(cursor.x + 168 > 748)
                    cursor.x = 76;
                else
                    cursor.x += 168;
            }
            else{
                if(cursor.x + 168 > 673)
                    cursor.x = 169;
                else
                    cursor.x += 168;   
            }
        }
    },

    cursorUp : function() {
        if(cursor.y == 530){
            cursor.clear();
            cursor.lineStyle(2, 0x00ff00, 1);
            cursor.drawRect(0, 0, 86, 86);
            cursor.x = oldX;
            cursor.y = oldY;
        }
    },

    cursorDown : function() {
        if(cursor.y == 196){
            oldX = cursor.x;
            oldY = cursor.y;

            cursor.clear();
            cursor.lineStyle(2, 0x00ff00, 1);
            cursor.drawRect(0, 0, 140, 37);
            cursor.x = 720;
            cursor.y = 530;
        }
    }
};
