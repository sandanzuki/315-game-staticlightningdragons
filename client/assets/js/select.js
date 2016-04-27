var cursor,
    oldX, oldY;

var position = "up";
var index;
var symbols;
var request,
    spritesLayer,
    arrow;

var Select = {
    preload : function() {
        symbols = [];
        units = [];
        otherUnits = [];
        game.load.image('select', './assets/images/select.png');
        game.load.image('fighter', './assets/images/fighter_symbol.png');
        game.load.image('archer', './assets/images/archer_symbol.png');
        game.load.image('mage', './assets/images/mage_symbol.png');
        game.load.image('healer', './assets/images/healer_symbol.png');
        game.load.image('arrow', './assets/images/arrow_white.png')
        
        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        var bg = this.add.sprite(0, 0, 'select');
        bg.z = 10;

        spritesLayer = game.add.group();
        spritesLayer.z = 100;
        cursor = game.add.graphics();
        cursor.lineStyle(2, 0x00ff00, 1);
        cursor.beginFill(0x00ff00, .5);
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

        request = new Object();
        request.game_id = game_id;
        request.request_id = 45;
        request.type = "UnitSelectionRequest";
        request.first;
        request.second;
        request.third;
        request.fourth;
        request.fifth;
    },

    symbolLocation : function(oldX) {
        switch(oldX){
            case(76):
                index = 0;
                break;
            case(244):
                index = 1;
                break;
            case(412):
                index = 2;
                break;
            case(580):
                index = 3;
                break;
            case(748):
                index = 4;
                break;
            default:
                break;
        }
    },

    startGame : function() {
        if(position == "up"){
            if(arrow.y == 520){
                if(symbols.length == 5){
                    var strReq;

                    request.first = units[0];
                    request.second = units[1];
                    request.third = units[2];
                    request.fourth = units[3];
                    request.fifth = units[4];

                    strReq = JSON.stringify(request);
                    console.log(strReq);
                    connection.send(strReq);
                }
            }
            else {
                this.symbolLocation(cursor.x);
                if(symbols[index]) {
                    symbols[index].destroy();
                    symbols.splice(index, 1);
                    units.splice(index, 1);
                }
                else {
                    cursor.clear();
                    position = "down";
                    oldX = cursor.x;
                    oldY = cursor.y;

                    cursor.lineStyle(2, 0x00ff00, 1);
                    cursor.beginFill(0x00ff00, .5);
                    cursor.drawRect(0, 0, 70, 70);

                    cursor.x = 169;
                    cursor.y = 409;
                }
            }
        }
        else if (position == "down"){
            position = "up";
            this.symbolLocation(oldX);

            switch(cursor.x){
                case(169):
                    symbols[index] = this.add.sprite(oldX, oldY, 'mage');
                    units[index] = "MAGE";
                    break;
                case(337):
                    symbols[index] = this.add.sprite(oldX, oldY, 'archer');
                    units[index] = "ARCHER";
                    break;
                case(505):
                    symbols[index] = this.add.sprite(oldX, oldY, 'fighter');
                    units[index] = "FIGHTER";
                    break;
                case(673):
                    symbols[index] = this.add.sprite(oldX, oldY, 'healer');
                    units[index] = "HEALER";
                    break;
                default:
                    break;
            }

            spritesLayer.add(symbols[index]);
            cursor.clear();
            cursor.lineStyle(2, 0x00ff00, 1);
            cursor.beginFill(0x00ff00, .5);
            cursor.drawRect(0, 0, 86, 86);

            if(oldX+168 > 748)
                cursor.x = oldX;
            else
                cursor.x = oldX+=168;
            cursor.y = oldY;

            if(symbols.length == 5)
                this.cursorDown();
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
        if(arrow.y == 520){
            arrow.destroy();

            cursor.lineStyle(2, 0x00ff00, 1);
            cursor.beginFill(0x00ff00, .5);
            cursor.drawRect(0, 0, 86, 86);

            cursor.x = oldX;
            cursor.y = oldY;
        }
    },

    cursorDown : function() {
        if(cursor.y == 196){
            arrow = this.add.sprite(0, 0, 'arrow');
            oldX = cursor.x;
            oldY = cursor.y;

            cursor.clear();
            arrow.x = 685;
            arrow.y = 520;
        }
    }
};