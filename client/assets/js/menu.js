var music_intro,
    arrow,
    x, y,
    opponentId,
    response = new Object(),
    bool_host = 0; 

var Menu = {
    preload : function() {
        game.load.image('menu', './assets/images/menu.png');
        game.load.image('arrow_white', './assets/images/arrow_white.png');

        game.load.audio('intro', './assets/audio/music/Exposition.ogg');

        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'menu'); // add background
        arrow = this.add.sprite(205, 345, 'arrow_white');

        //bg music when ready
        music_intro = game.add.audio('intro');
        music_intro.loopFull();

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
            console.log(strReq);
            connection.send(strReq);
        };

        connection.onmessage = function(yas){
            Menu.checkResponse(yas);
        };

        bool_host = 1;
    },

    join : function(){
        connection = new WebSocket("ws://pulse.bitwisehero.com:13337", "rqs");
        connection.onmessage = function(yas){
            Menu.checkResponse(yas);
        };

        bool_host = 0;
        this.state.start('GameID');
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

                    game_id = response.game_id;
                    if(bool_host == 1)
                        this.state.start('GameID');
                    break;
                case("StateChangeEvent"):
                    console.log(response);
                    if(response.state == "SELECTION"){
                        this.state.start('Tutorial');
                    }
                    else if(response.state == "GAME_OVER"){
                        if(friendCount > 0){
                            console.log("hello");
                            game.win = true;
                            this.state.start('GameOver');
                        }
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
                        units = response.player_one;
                    }
                    else if(playerId == 2){
                        otherUnits = response.player_one;
                        units = response.player_two;
                    }
                    // turn off intro music 
                    //music_intro.destroy();  
                    //game.cache.removeSound('intro');
                    this.state.start('Game');
                    break;
                case("TurnChangeEvent"):
                    console.log(response);
                    turn = response.player_turn;
                    Game.notifyTurnChange(turn);
                    Game.initTimer();
                    var check = false;

                    if(turn == playerId){
                        for(var i = 0; i<friendlyUnits.length; i++){
                            if(friendlyUnits[i].locked)
                                check = true
                        }
                        if(check)
                            Game.unlockUnits(friendlyUnits);
                    }
                    break;
                case("UnitMoveEvent"):
                    console.log(response);
                    valid = true;
                    opponentId = response.unit_id;
                    x = response.unit_x;
                    y = response.unit_y;
                    Game.opponentMove(opponentId, x, y);

                    break;
                case("UnitInteractEvent"):
                    console.log(response);
                    var targetId;
                    var targetHp;
                    var unitId;
                    var unitHp;

                    targetId = response.target_id;
                    targetHp = response.target_hp;
                    unitId = response.unit_id;
                    unitHp = response.unit_hp;

                    if(targetId != -1)
                        Game.hpBarsHit(targetId, targetHp, unitId, unitHp);
                    
                    if(targetHp == 0)
                        Game.killUnit(true, targetId);
                    if(unitHp == 0)
                        Game.killUnit(false, unitId);
                    else
                        Game.lockUnit(friendlyUnits[unitId]);

                    break;
                case("PlayerRenameEvent"):
                    console.log(response);
                    if(playerServerId != response.player_id)
                        opponentName = response.name;
                    break;
                default:
                    console.log(response);
                    break;
            }
        }
    }
};
