// var username = []; 
//var username,
 //   bmd; 

window.print = function() {
    for(var i = 0; i < 10; i++)
        window.alert(username[i]); 
}

var Username = {
    preload : function() {
        game.load.image('select', './assets/images/name_prompt.png');

        // align canvas
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    create : function() {
        this.add.sprite(0, 0, 'select');

       username = game.add.text(game.world.centerX, game.world.centerY, "", {
            font: "65px Arial",
            fill: "#ffffff",
            align: "center"
        });
        //  Capture all key presses
        // game.input.keyboard.addCallbacks(this, null, null, keyPress);


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

        enterButton.onDown.add(this.startGame, this);
        deleteButton.onDown.add(this.startGame, this);

        returnA.onDown.add(this.pushA, this); 
        returnB.onDown.add(this.pushB, this); 
        returnC.onDown.add(this.pushC, this); 
        returnD.onDown.add(this.pushD, this); 
        returnE.onDown.add(this.pushE, this); 
        returnF.onDown.add(this.pushF, this); 
        returnG.onDown.add(this.pushG, this); 
        returnH.onDown.add(this.pushH, this); 
        returnI.onDown.add(this.pushI, this); 
        returnJ.onDown.add(this.pushJ, this); 
        returnK.onDown.add(this.pushK, this); 
        returnL.onDown.add(this.pushL, this); 
        returnM.onDown.add(this.pushM, this); 
        returnN.onDown.add(this.pushN, this); 
        returnO.onDown.add(this.pushO, this); 
        returnP.onDown.add(this.pushP, this); 
        returnQ.onDown.add(this.pushQ, this); 
        returnR.onDown.add(this.pushR, this); 
        returnS.onDown.add(this.pushS, this); 
        returnT.onDown.add(this.pushT, this); 
        returnU.onDown.add(this.pushU, this); 
        returnV.onDown.add(this.pushV, this); 
        returnW.onDown.add(this.pushW, this); 
        returnX.onDown.add(this.pushX, this); 
        returnY.onDown.add(this.pushY, this); 
        returnZ.onDown.add(this.pushZ, this); 

        return0.onDown.add(this.push0, this); 
        return1.onDown.add(this.push1, this); 
        return2.onDown.add(this.push2, this); 
        return3.onDown.add(this.push3, this); 
        return4.onDown.add(this.push4, this); 
        return5.onDown.add(this.push5, this); 
        return6.onDown.add(this.push6, this); 
        return7.onDown.add(this.push7, this); 
        return8.onDown.add(this.push8, this); 
        return9.onDown.add(this.push9, this); 
    },

    pushA : function() {username.text = username.text.concat("a")},
    pushB : function() {username.text = username.text.concat("b")},
    pushC : function() {username.text = username.text.concat("c")},
    pushD : function() {username.push("d")},
    pushE : function() {username.push("e")},
    pushF : function() {username.push("f")},
    pushG : function() {username.push("g")},
    pushH : function() {username.push("h")},
    pushI : function() {username.push("i")},
    pushJ : function() {username.push("j")},
    pushK : function() {username.push("k")},
    pushL : function() {username.push("l")},
    pushM : function() {username.push("m")},
    pushN : function() {username.push("n")},
    pushO : function() {username.push("o")},
    pushP : function() {username.push("p")},
    pushQ : function() {username.push("q")},
    pushR : function() {username.push("r")},
    pushS : function() {username.push("s")},
    pushT : function() {username.push("t")},
    pushU : function() {username.push("u")},
    pushV : function() {username.push("v")},
    pushW : function() {username.push("w")},
    pushX : function() {username.push("x")},
    pushY : function() {username.push("y")},
    pushZ : function() {username.push("z")},

    push0 : function() {username.push("0")},
    push1 : function() {username.push("1")},
    push2 : function() {username.push("2")},
    push3 : function() {username.push("3")},
    push4 : function() {username.push("4")},
    push5 : function() {username.push("5")},
    push6 : function() {username.push("6")},
    push7 : function() {username.push("7")},
    push8 : function() {username.push("8")},
    push9 : function() {username.push("9")},

     
    startGame : function() {
        // print();
        // bmd.draw(username, game.world.randomX, game.world.randomY, null, null, 'destination-out');
        this.state.start('Select');
    }
};
