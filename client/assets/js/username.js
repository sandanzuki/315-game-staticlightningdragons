var username,
    nameRequest,
    wordcount = 0;

var Username = {
    preload : function() {
        game.load.image('select', './assets/images/name_prompt.png');

        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'select');
        nameRequest = new Object();

        username = game.add.text(game.world.centerX-225, game.world.centerY, "", {
            font: "75px Playfair Display",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: "#ffffff"
        });
        username.setTextBounds(0, 0, 450, 100);

        // keyboard input assignments
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        deleteButton = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);

        returnA = game.input.keyboard.addKey(Phaser.Keyboard.A);
        returnB = game.input.keyboard.addKey(Phaser.Keyboard.B);
        returnC = game.input.keyboard.addKey(Phaser.Keyboard.C);
        returnD = game.input.keyboard.addKey(Phaser.Keyboard.D);
        returnE = game.input.keyboard.addKey(Phaser.Keyboard.E);
        returnF = game.input.keyboard.addKey(Phaser.Keyboard.F);
        returnG = game.input.keyboard.addKey(Phaser.Keyboard.G);
        returnH = game.input.keyboard.addKey(Phaser.Keyboard.H);
        returnI = game.input.keyboard.addKey(Phaser.Keyboard.I);
        returnJ = game.input.keyboard.addKey(Phaser.Keyboard.J);
        returnK = game.input.keyboard.addKey(Phaser.Keyboard.K);
        returnL = game.input.keyboard.addKey(Phaser.Keyboard.L);
        returnM = game.input.keyboard.addKey(Phaser.Keyboard.M);
        returnN = game.input.keyboard.addKey(Phaser.Keyboard.N);
        returnO = game.input.keyboard.addKey(Phaser.Keyboard.O);
        returnP = game.input.keyboard.addKey(Phaser.Keyboard.P);
        returnQ = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        returnR = game.input.keyboard.addKey(Phaser.Keyboard.R);
        returnS = game.input.keyboard.addKey(Phaser.Keyboard.S);
        returnT = game.input.keyboard.addKey(Phaser.Keyboard.T);
        returnU = game.input.keyboard.addKey(Phaser.Keyboard.U);
        returnV = game.input.keyboard.addKey(Phaser.Keyboard.V);
        returnW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        returnX = game.input.keyboard.addKey(Phaser.Keyboard.X);
        returnY = game.input.keyboard.addKey(Phaser.Keyboard.Y);
        returnZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        return0 = game.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        return1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        return2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        return3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        return4 = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        return5 = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        return6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
        return7 = game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
        return8 = game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
        return9 = game.input.keyboard.addKey(Phaser.Keyboard.NINE);
        numpad0 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_0);
        numpad1 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1);
        numpad2 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2);
        numpad3 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_3);
        numpad4 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_4);
        numpad5 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_5);
        numpad6 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_6);
        numpad7 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_7);
        numpad8 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8);
        numpad9 = game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_9);

        // map keys to function 
        enterButton.onDown.add(this.startGame, this);
        deleteButton.onDown.add(this.deleteChar, this);

        returnA.onDown.add(this.push_A, this); 
        returnB.onDown.add(this.push_B, this); 
        returnC.onDown.add(this.push_C, this); 
        returnD.onDown.add(this.push_D, this); 
        returnE.onDown.add(this.push_E, this); 
        returnF.onDown.add(this.push_F, this); 
        returnG.onDown.add(this.push_G, this); 
        returnH.onDown.add(this.push_H, this); 
        returnI.onDown.add(this.push_I, this); 
        returnJ.onDown.add(this.push_J, this); 
        returnK.onDown.add(this.push_K, this); 
        returnL.onDown.add(this.push_L, this); 
        returnM.onDown.add(this.push_M, this); 
        returnN.onDown.add(this.push_N, this); 
        returnO.onDown.add(this.push_O, this); 
        returnP.onDown.add(this.push_P, this); 
        returnQ.onDown.add(this.push_Q, this); 
        returnR.onDown.add(this.push_R, this); 
        returnS.onDown.add(this.push_S, this); 
        returnT.onDown.add(this.push_T, this); 
        returnU.onDown.add(this.push_U, this); 
        returnV.onDown.add(this.push_V, this); 
        returnW.onDown.add(this.push_W, this); 
        returnX.onDown.add(this.push_X, this); 
        returnY.onDown.add(this.push_Y, this); 
        returnZ.onDown.add(this.push_Z, this); 
        return0.onDown.add(this.push_0, this); 
        return1.onDown.add(this.push_1, this); 
        return2.onDown.add(this.push_2, this); 
        return3.onDown.add(this.push_3, this); 
        return4.onDown.add(this.push_4, this); 
        return5.onDown.add(this.push_5, this); 
        return6.onDown.add(this.push_6, this); 
        return7.onDown.add(this.push_7, this); 
        return8.onDown.add(this.push_8, this); 
        return9.onDown.add(this.push_9, this); 
        numpad0.onDown.add(this.push_0, this); 
        numpad1.onDown.add(this.push_1, this); 
        numpad2.onDown.add(this.push_2, this); 
        numpad3.onDown.add(this.push_3, this); 
        numpad4.onDown.add(this.push_4, this); 
        numpad5.onDown.add(this.push_5, this); 
        numpad6.onDown.add(this.push_6, this); 
        numpad7.onDown.add(this.push_7, this); 
        numpad8.onDown.add(this.push_8, this); 
        numpad9.onDown.add(this.push_9, this); 
    },

    // mapped functions
    push_A : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("a"); 
            wordcount++;
        }
    },

    push_B : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("b"); 
            wordcount++;
        }
    },

    push_C : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("c"); 
            wordcount++;
        }
    },

    push_D : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("d"); 
            wordcount++;
        }
    },

    push_E : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("e"); 
            wordcount++;
        }
    },

    push_F : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("f"); 
            wordcount++;
        }
    },

    push_G : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("g"); 
            wordcount++;
        }
    },

    push_H : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("h"); 
            wordcount++;
        }
    },

    push_I : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("i"); 
            wordcount++;
        }
    },

    push_J : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("j"); 
            wordcount++;
        }
    },

    push_K : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("k"); 
            wordcount++;
        }
    },

    push_L : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("l"); 
            wordcount++;
        }
    },

    push_M : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("m"); 
            wordcount++;
        }
    },

    push_N : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("n"); 
            wordcount++;
        }
    },

    push_O : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("o"); 
            wordcount++;
        }
    },

    push_P : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("p"); 
            wordcount++;
        }
    },

    push_Q : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("q"); 
            wordcount++;
        }
    },

    push_R : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("r"); 
            wordcount++;
        }
    },

    push_S : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("s"); 
            wordcount++;
        }
    },

    push_T : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("t"); 
            wordcount++;
        }
    },

    push_U : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("u"); 
            wordcount++;
        }
    },

    push_V : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("v"); 
            wordcount++;
        }
    },

    push_W : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("w"); 
            wordcount++;
        }
    },

    push_X : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("x"); 
            wordcount++;
        }
    },

    push_Y : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("y"); 
            wordcount++;
        }
    },

    push_Z : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("z"); 
            wordcount++;
        }
    },

    push_0 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("0"); 
            wordcount++;
        }
    },

    push_1 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("1"); 
            wordcount++;
        }
    },

    push_2 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("2"); 
            wordcount++;
        }
    },

    push_3 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("3"); 
            wordcount++;
        }
    },

    push_4 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("4"); 
            wordcount++;
        }
    },

    push_5 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("5"); 
            wordcount++;
        }
    },

    push_6 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("6"); 
            wordcount++;
        }
    },

    push_7 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("7"); 
            wordcount++;
        }
    },

    push_8 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("8"); 
            wordcount++;
        }
    },

    push_9 : function() {
        if(wordcount < 15) {
            username.text = username.text.concat("9"); 
            wordcount++;
        }
    },

    // clear username 
    deleteChar: function() {
        wordcount = 0;
        username.destroy();
        username = game.add.text(game.world.centerX-225, game.world.centerY, "", {
            font: "75px Playfair Display",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            fill: "#ffffff"
        });
        username.setTextBounds(0, 0, 450, 100);
    },

    // to next state
    startGame : function() {
        console.log(username._text);  // for checking if string username stores
        var strReq;
        nameRequest.game_id = game_id;
        nameRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
        nameRequest.type = "PlayerRenameRequest";
        nameRequest.name = username._text;

        strReq = JSON.stringify(nameRequest);
        console.log(strReq);
        connection.send(strReq);
        this.state.start('Select');
    }
};