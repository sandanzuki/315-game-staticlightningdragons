var clang, intro_music,
    arrow,
    response = new Object(); 

var Menu = {
    preload : function() {
        game.load.image('menu', './assets/images/menu.png');
        game.load.image('arrow_white', './assets/images/arrow_white.png');

        game.load.audio('clang', './assets/audio/soundeffects/clang.mp3');
        game.load.audio('intro', './assets/audio/music/intro.m4a');

        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'menu'); // add background
        arrow = this.add.sprite(205, 345, 'arrow_white');

        clang = game.add.audio('clang');
        //bg music when ready
        // intro_music = game.add.audio('intro');
        // intro_music.loopFull();

        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.select, this);

        downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downButton.onDown.add(this.moveDown, this);

        upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upButton.onDown.add(this.moveUp, this);
    },

    moveDown : function() {
        if(arrow.y + 40 > 385)
            arrow.y = 345;
        else
            arrow.y += 40;
        switch(arrow.y){
            case(345):
                arrow.x = 205;
                break;
            case(385):
                arrow.x = 280;
                break;
            default:
                break;
        }
    },

    moveUp : function() {
        if(arrow.y - 40 < 345)
            arrow.y = 385;
        else
            arrow.y -= 40;
        switch(arrow.y){
            case(345):
                arrow.x = 205;
                break;
            case(385):
                arrow.x = 280;
                break;
            default:
                break;
        }
    },

    select : function() {
        switch(arrow.y){
            case(345):
                this.join();
                break;
            case(385):
                this.host();
                break;
            default:
                break;
        }
    },

    host : function() {
        connection = new WebSocket("ws://pulse.bitwisehero.com:13337", "rqs");

        connection.onopen = function() {            
            request = new Object();
            request.game_id = -2;
            request.request_id = 42;
            request.type = "AssignGameRequest";
               
            var strReq = JSON.stringify(request);
            connection.send(strReq);
        };

        connection.onmessage = function(yas){
            Menu.checkResponse(yas);
        };

    },

    join : function(){
        connection = new WebSocket("ws://pulse.bitwisehero.com:13337", "rqs");

        connection.onopen = function() {
            request = new Object();
            request.game_id = -1;
            request.request_id = 43;
            request.type = "AssignGameRequest";            
            
            var strReq = JSON.stringify(request);
            connection.send(strReq);
        };

        connection.onmessage = function(yas){
            Menu.checkResponse(yas);
        };

    },

    checkResponse : function(yas){
        response = eval("("+yas.data+")");
        if(response){
            switch(response.type){
                case("AssignGameEvent"):
                    console.log(response);
                    if(response.player_two_id == -1){
                        playerId = 1;
                        playerServerId = response.player_one_id;
                    }
                    else{
                        if(!playerId){
                            playerId = 2;
                            playerServerId = response.player_two_id;
                        }
                    }
                    gameId = response.game_id;
                    this.state.start('Load');
                    break;
                case("StateChangeEvent"):
                    console.log(response);
                    if(response.state == "SELECTION"){
                        this.state.start('Tutorial');
                    }
                    break;
                case("SelectUnitsEvent"):
                    console.log(response);
                    if(response.player_id == playerServerId)
                        this.state.start('Load');
                    break;
                case("AllUnitsSelectedEvent"):
                    console.log(response);
                    if(playerId == 1){
                        otherUnits = response.player_two;
                    }
                    else if(playerId == 2){
                        otherUnits = response.player_one;
                    }
                    this.state.start('Game');
                    break;
                case("TurnChangeEvent"):
                    console.log(response);
                    turn = response.player_turn;
                    break;
                case("UnitMoveEvent"):
                    console.log(response);
                    var opponentId = response.unit_id;
                    var x = response.unit_x;
                    var y = response.unit_y;
                    Game.opponentMove(opponentId, x, y);
                    break;
                case("UnitInteractEvent"):
                    console.log(response);
                    break;
                default:
                    console.log(response);
                    break;
            }
        }
    }
};




