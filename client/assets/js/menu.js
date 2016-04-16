var clang, intro_music,
    arrow; 

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
        connection.onmessage = function(yas){console.log(yas);}

        //window.alert(connection.readyState);
        connection.onopen = function() {            
            request = new Object();
            request.game_id = -2;
            request.request_id = 42;
            request.type = "AssignGameRequest";
               
            var strReq = JSON.stringify(request);
            console.log(strReq);
            connection.send(strReq);
        };
        this.state.start('Load');
    },

    join : function(){
        connection = new WebSocket("ws://pulse.bitwisehero.com:13337", "rqs");
        connection.onmessage = function(yas){console.log(yas);}

        connection.onopen = function() {
            request = new Object();
            request.game_id = -1;
            request.request_id = 43;
            request.type = "AssignGameRequest";            
            
            var strReq = JSON.stringify(request);
            console.log(request);
            connection.send(strReq);
        };
        this.state.start('Load');
    }
};


