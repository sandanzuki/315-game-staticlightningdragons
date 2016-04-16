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
        //bg music when ready
        // intro_music = game.add.audio('intro');
        // intro_music.loopFull();

        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterButton.onDown.add(this.startLoad, this);

        jButton = game.input.keyboard.addKey(Phaser.Keyboard.J);
        jButton.onDown.add(this.join, this);

        spaceButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceButton.onDown.add(this.prepClient, this);
    },

    check : function() {
        window.alert(connection.readyState);
        //connection.send("Hello");
    },

    startLoad : function() {
        // start loading, change game state
        this.state.start('Load');
    },

    prepClient : function() {
        connection = new WebSocket("ws://pulse.bitwisehero.com:13337", "rqs");
        connection.onmessage = function(yas){console.log(yas);}

        //window.alert(connection.readyState);
        connection.onopen = function() {
            window.alert(connection.readyState);
            
            var request = new Object();
            request.game_id = -2;
            request.request_id = 42;
            request.type = "AssignGameRequest";
               
            var strReq = JSON.stringify(request);
            console.log(strReq);
            connection.send(strReq);
        };
    },

    join : function(){
        connection = new WebSocket("ws://pulse.bitwisehero.com:13337", "rqs");
        connection.onmessage = function(yas){console.log(yas);}

        connection.onopen = function() {
            window.alert(connection.readyState);
            var request = '{"game_ id":"-1","request_id":"43","type":"AssignGameRequest"}';
            JSON.stringify(request);
            console.log(request);
            connection.send(request);
        }
    }
};


