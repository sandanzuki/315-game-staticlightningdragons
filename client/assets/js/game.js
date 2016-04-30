var map,
    timer,
    option,
    arrow,
    background,
    graphics,
    blocked,
    cursor,
    bFighter, bArcher, bMage, bHealer,
    hBars = [],
    enemyHBars = [],
    rFighter, rArcher, rMage, rHealer,
    max,
    dummyUnit,
    possibleTiles = [],
    attackTiles = [],
    coordinates = [],
    isDown,
    graphics,
    lockGraphics,
    selected,
    lockCounter = 0,
    friendlyUnits = [],
    friendCount = 5,
    enemyUnits = [],
    enemyCount = 5,
    pause = false,
    battle_music,
    moveRequest = new Object(),
    attackRequest = new Object(),
    hb_cnfg = { // healthbar
        width: 35,
        height: 4,
        x: 100,
        y: 100,
        bg: {color: '#FF4D4D'},
        bar: {color: '#33FF33'},
        animationDuration: 400,
        flipped: false 
    },
    counter = 60,
    playerTurn,
    tutorialState = true,
    attackRequest = new Object(),
    lockRequest = new Object();

var Game = { 
    preload : function() {
        // load map
        game.load.tilemap('Map', './assets/js/map2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', './assets/images/map2.png');

        // blue units
        game.load.image('b_archer', './assets/images/b_archer.png');
        game.load.image('b_mage', './assets/images/b_mage.png');
        game.load.image('b_fighter', './assets/images/b_fighter.png');
        game.load.image('b_healer', './assets/images/b_healer.png');

        //red units
        game.load.image('r_archer', './assets/images/r_archer.png');
        game.load.image('r_mage', './assets/images/r_mage.png');
        game.load.image('r_fighter', './assets/images/r_fighter.png');
        game.load.image('r_healer', './assets/images/r_healer.png');

        game.load.image('option', './assets/images/option.png');
        game.load.image('arrow', './assets/images/arrow_white.png');
        game.load.image('cursor', './assets/images/cursor.png');

        //load bg music here.. must load in this game state!
        game.load.audio('battle', './assets/audio/music/battle.m4a');
    },

    create : function() {
        // show map
        game.physics.startSystem(Phaser.Physics.ARCADE);
        isDown = 0;
        map = game.add.tilemap('Map');

        // building the map as intended in Tiled
        map.addTilesetImage('tileset2', 'gameTiles');

        // create layers
        background = map.createLayer('backgroundLayer');
        blocked = map.createLayer('blockedLayer');

        game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

        time_font = game.add.text(850, game.height -50, '60', { 
            font: "35px Playfair Display",
            fill: "#000000", 
            align: "center" 
        });

        time_font.fixedToCamera = true;

        var info = game.add.text(0, game.height - 25, 'Player turn: ', {
            font: "25px Playfair Display",
            fill: "#000000", 
            align: "center" 
        });

        info.fixedToCamera = true;

        var text = game.add.text(0, game.height - 50, '', {
            font: "25px Playfair Display",
            fill: "#000000", 
            align: "center" 
        });

        text.text = "You Are Player: " + playerId + " - " +username._text;
        text.fixedToCamera = true;

        playerTurn = game.add.text(140, game.height - 25, turn, {
            font: "25px Playfair Display",
            fill: "#000000", 
            align: "center" 
        });

        playerTurn.fixedToCamera = true;

        if(turn == playerId)
            playerTurn.text = turn + " - " + username._text;
        else
            playerTurn.text = turn + " - " + opponentName;

        // bg music can go here when ready
        // battle_music = game.add.audio('battle');
        // battle_music.loopFull();

        //create health bars then load the units
        myHealthBar = new HealthBar(this.game, hb_cnfg);
        myHealthBar2 = new HealthBar(this.game, hb_cnfg);
        myHealthBar3 = new HealthBar(this.game, hb_cnfg);
        myHealthBar4 = new HealthBar(this.game, hb_cnfg);
        myHealthBar5 = new HealthBar(this.game, hb_cnfg); 

        hBars = [myHealthBar, myHealthBar2, myHealthBar3, myHealthBar4, myHealthBar5];

        myHealthBar6 = new HealthBar(this.game, hb_cnfg);
        myHealthBar7 = new HealthBar(this.game, hb_cnfg);
        myHealthBar8 = new HealthBar(this.game, hb_cnfg);
        myHealthBar9 = new HealthBar(this.game, hb_cnfg);
        myHealthBar10 = new HealthBar(this.game, hb_cnfg); 

        enemyHBars = [myHealthBar6, myHealthBar7, myHealthBar8, myHealthBar9, myHealthBar10];

        this.loadUnits();

        for(var i = 0; i<friendlyUnits.length; i++){
            hBars[i].setPosition(friendlyUnits[i].x+30, friendlyUnits[i].y);
            enemyHBars[i].setPosition(enemyUnits[i].x+30, enemyUnits[i].y);
        }

        graphics = game.add.graphics();
        lockGraphics = game.add.graphics();//identify a locked unit
        selected = game.add.graphics();//identify the user's selected unit
     

        background.resizeWorld();
        blocked.resizeWorld();

        moveRequest.game_id = game_id;
        moveRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
        moveRequest.type = "UnitMoveRequest"; 
        moveRequest.unit_id;
        moveRequest.x;
        moveRequest.y;

        attackRequest.game_id = game_id;
        attackRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
        attackRequest.type = "UnitInteractRequest";
        attackRequest.unit_id;
        attackRequest.target_id;

        lockRequest.game_id = game_id;
        lockRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
        lockRequest.type = "UnitInteractRequest";
        lockRequest.unit_id;
        lockRequest.target_id = -1;

        if(playerId == 1)
            cursor = game.add.sprite(1, 781, 'cursor');
        else if(playerId == 2){
            var x = map.widthInPixels-59;
            var y = 181;
            cursor = game.add.sprite(x, y, 'cursor');
        }

        game.physics.enable(cursor);
        game.camera.follow(cursor);
    },

    update : function() {
        downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        downButton.onDown.add(this.cursorDown, this);
        upButton.onDown.add(this.cursorUp, this);
        leftButton.onDown.add(this.cursorLeft, this);
        rightButton.onDown.add(this.cursorRight, this);
        enterButton.onDown.add(this.choosingMove, this);
        pauseButton.onDown.add(this.pauseGame, this);
    },

    initTimer : function() {
        counter = 60;
    },

    updateCounter : function() {
        if(counter >= 0)
            counter--;

        time_font.setText(counter);

        if(counter == 0){
            for(var i = 0; i<friendlyUnits.length; i++){
                if(turn == playerId){
                    if(!friendlyUnits[i].locked){
                    lockRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
                    lockRequest.unit_id = friendlyUnits[i].id;

                    strReq = JSON.stringify(lockRequest);
                    connection.send(strReq);
                    }

                    this.lockUnit(friendlyUnits[i]);
                }
            }
        }
    },
    // load units onto tilemap
    loadUnits : function() {
        var blueX, blueY,
        redX, redY;
        switch(playerId){
            case(1):
                blueX = 0;
                blueY = 660;
                redX = map.widthInPixels-60;
                redY = 60;
                break;
            case(2):
                blueX = map.widthInPixels-60;
                blueY = 60;
                redX = 0;
                redY = 660;
                break;
            default:
                break;
        }

        //add all blue sprites to the map
        for(var i = 1; i<=5; i++){
            switch(units[i].type){
                case "FIGHTER":
                    bFighter = game.add.sprite(blueX, blueY,'b_fighter');
                    bFighter.hBar = hBars[i-1];
                    hBars[i-1].setPosition(30, 0);

                    map.getTileWorldXY(blueX,blueY).properties.unitType = 1; 
                    map.getTileWorldXY(blueX,blueY).unit = bFighter; 
                    bFighter.health = units[i].hp;
                    bFighter.name = "Friendly Fighter";
                    bFighter.id = i-1;
                    bFighter.owner = playerId;
                    friendlyUnits.push(bFighter); 
                    break;
                case "ARCHER":
                    bArcher = game.add.sprite(blueX, blueY,'b_archer');
                    map.getTileWorldXY(blueX, blueY).properties.unitType = 2;
                    map.getTileWorldXY(blueX, blueY).unit = bArcher;
                    bArcher.health = units[i].hp;
                    bArcher.name = "Friendly Archer";
                    bArcher.id = i-1;
                    bArcher.owner = playerId;
                    friendlyUnits.push(bArcher);
                    break;
                case "MAGE":
                    bMage = game.add.sprite(blueX, blueY,'b_mage');
                    friendlyUnits.push(bMage);
                    map.getTileWorldXY(blueX, blueY).properties.unitType = 3;
                    map.getTileWorldXY(blueX, blueY).unit = bMage;
                    bMage.health = units[i].hp;
                    bMage.name = "Friendly Mage";
                    bMage.id = i-1;
                    bMage.owner = playerId;
                    break;
                case "HEALER":
                    bHealer = game.add.sprite(blueX, blueY,'b_healer');
                    friendlyUnits.push(bHealer);
                    map.getTileWorldXY(blueX, blueY).properties.unitType = 4;
                    map.getTileWorldXY(blueX, blueY).unit = bHealer;
                    bHealer.health = units[i].hp;
                    bHealer.name = "Friendly Healer";
                    bHealer.id = i-1;
                    bHealer.owner = playerId;
                    break;
                default:
                    break;
            }
            blueY += 60;
        }

        var enemyId;
        if(playerId == 1){
            enemyId = 2;
        }
        else{
            enemyId = 1;
        }

        //add all red sprites to the map
        for(var i = 1; i<=5; i++){
            switch(otherUnits[i].type){
                case "FIGHTER":
                    rFighter = game.add.sprite(redX, redY, 'r_fighter');
                    enemyUnits.push(rFighter);
                    map.getTileWorldXY(redX, redY).properties.unitType = 1;
                    map.getTileWorldXY(redX, redY).unit = rFighter;
                    rFighter.health = otherUnits[i].hp;
                    rFighter.name = "Enemy Fighter";
                    rFighter.id = i-1;
                    rFighter.owner = enemyId;
                    break;

                case "ARCHER":
                    rArcher = game.add.sprite(redX, redY, 'r_archer');
                    enemyUnits.push(rArcher);
                    map.getTileWorldXY(redX, redY).properties.unitType = 2
                    map.getTileWorldXY(redX, redY).unit = rArcher;
                    map.getTileWorldXY(redX, redY).unit = rArcher;
                    rArcher.health = otherUnits[i].hp;
                    rArcher.name = "Enemy Archer";
                    rArcher.id = i-1;
                    rArcher.owner = enemyId;
                    break;

                case "MAGE":
                    rMage = game.add.sprite(redX, redY, 'r_mage');
                    enemyUnits.push(rMage);
                    map.getTileWorldXY(redX, redY).properties.unitType = 3;
                    map.getTileWorldXY(redX, redY).unit = rMage;
                    rMage.health = otherUnits[i].hp;
                    rMage.name = "Enemy Mage";
                    rMage.id = i-1;
                    rMage.owner = enemyId;
                    break;

                case "HEALER":
                    rHealer = game.add.sprite(redX, redY,'r_healer');
                    enemyUnits.push(rHealer);
                    map.getTileWorldXY(redX, redY).properties.unitType = 4;
                    map.getTileWorldXY(redX, redY).unit = rHealer;
                    rHealer.health = otherUnits[i].hp;
                    rHealer.name = "Enemy Healer";
                    rHealer.id = i-1;
                    rHealer.owner = enemyId;
                    break;

                default:
                    break;
            }
            redY += 60;
        }

        for (var i = 0; i < friendlyUnits.length; i++) {
            friendlyUnits[i].locked = false;
            friendlyUnits[i].friendly = true;
            friendlyUnits[i].id = i;
            enemyUnits[i].locked = false;
            enemyUnits[i].friendly = false;
            enemyUnits[i].id = i;
        }

        //dummy unit to be used as placeholder when units are killed
        dummyUnit = "eric";
        dummyUnit.locked = true;
        dummyUnit.friendly = true;
        dummyUnit.id = 72;
    },

    updateBar : function(i, x, y, isEnemy) {
        if(!isEnemy)
            hBars[i].setPosition(x+30, y);
        else
            enemyHBars[i].setPosition(x+30, y);
    },

    // move cursor tile by tile
    cursorDown : function() { 
        if (!pause) {
            // calculate (x, y) coordinates of the tile the cursor is on
            var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
            var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
            var i = background.index;
            var nextTile;

            if (y == map.height-1)
                nextTile = map.getTileAbove(i, x, 1);
            else
                nextTile = map.getTileBelow(i, x, y);

            cursor.x = nextTile.worldX+1;
            cursor.y = nextTile.worldY+1;
        } else {
            var x = game.camera.x;
            var y = game.camera.y;
            if (arrow.y+39 > y+422)
                arrow.y = y+305;
            else
                arrow.y += 39;

            switch (arrow.y) {
                case(y+305):
                    arrow.x = x+315;
                    break;

                case(y+344):
                    arrow.x = x+280;
                    break;

                case(y+383):
                    arrow.x = x+325;
                    break;

                case(y+422):
                    arrow.x = x+300;
                    break;

                default:
                    break;
            }
        }
    },

    cursorUp : function() {
        if (!pause) {
            var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
            var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
            var i = background.index;
            var nextTile;

            if (y == 0)
                nextTile = map.getTileBelow(i, x, 18);
            else
                nextTile = map.getTileAbove(i, x, y);

            cursor.x = nextTile.worldX+1;
            cursor.y = nextTile.worldY+1;
        } else {
            var x = game.camera.x;
            var y = game.camera.y;
            if (arrow.y-39 < y+305)
                arrow.y = y+422;
            else
                arrow.y -= 39;

            switch (arrow.y) {
                case(y+305):
                    arrow.x = x+315;
                    break;

                case(y+344):
                    arrow.x = x+280;
                    break;

                case(y+383):
                    arrow.x = x+325;
                    break;

                case(y+422):
                    arrow.x = x+300;
                    break;

                default:
                    break;
            }
        }
    },

    cursorLeft : function() {
        if (!pause) {
            var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
            var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
            var i = background.index;
            var nextTile;

            if (x == 0)
                nextTile = map.getTileRight(i, 23, y);
            else
                nextTile = map.getTileLeft(i, x, y);

            cursor.x = nextTile.worldX+1;
            cursor.y = nextTile.worldY+1;
        }
    },

    cursorRight : function() {
        if (!pause) {
            var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
            var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
            var i = background.index;
            var nextTile;

            if (x == map.width-1)
                nextTile = map.getTileLeft(i, 1, y);
            else
                nextTile = map.getTileRight(i, x, y);

            cursor.x = nextTile.worldX+1;
            cursor.y = nextTile.worldY+1;
        }
    },

    // functionality of 'enter'
    choosingMove : function() {
        if (!pause){
            if(turn == playerId){
                if (isDown == 0)
                    oldTile = this.moveMenu();
                else {
                    selected.clear();
                    this.moveComplete(coordinates);
                }
            }      
        } else {
            var x = game.camera.x;
            var y = game.camera.y;
            switch (arrow.y) {
                case(y+305):
                    pause = false;
                    option.destroy();
                    arrow.destroy();
                    break;

                case(y+344):
                    break;

                case(y+389):
                    break;

                case(y+422):
                    pause = false;
                    game.win = false;
                    request.game_id = game_id;
                    request.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
                    request.type = "PlayerQuitRequest";

                    var strReq;
                    strReq = JSON.stringify(request);

                    connection.send(strReq);
                    //turn off battle music here
                    //battle_music.destroy();
                    //game.cache.removeSound('battle');
                    this.state.start('GameOver');
                    break;

                default:
                    break;
            }
        }
    },

    // show unit movement
    moveMenu : function() {
        coordinates = [];
        var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
        var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
        // save the (x,y) coords in array for convenience
        // because phaser won't set equal someTile = tile
        coordinates[0] = x;
        coordinates[1] = y;

        var currTile = map.getTile(x,y, background);

        if (currTile != null) { // check if current tile is valid (exists on map)
            if (currTile.properties.unitType != 0) { // if the tile actually holds a unit, carry on
                if ((currTile.unit.locked == false) && (friendlyUnits.indexOf(currTile.unit) != -1)) { // if the unit is not locked, figure out what kind it is

                    // draw a spiffy looking gold square to represent a selected unit
                    selected.lineStyle(2, 0xffbf00, 1);
                    selected.beginFill(0xffbf00, .5);
                    selected.drawRect(currTile.worldX + 2, currTile.worldY + 2, 56, 56);
                    possibleTiles = [];

                    switch (currTile.properties.unitType) {
                        case 1: // unit is fighter
                            isDown = 1;
                            this.getMoveOptions(currTile, 1);
                            return currTile;
                            break;

                        case 2: // unit is archer
                            isDown = 1;
                            this.getMoveOptions(currTile, 2);
                            return currTile;
                            break;

                        case 3: // unit is mage
                            isDown = 1;
                            this.getMoveOptions(currTile, 3);
                            return currTile;
                            break;

                        case 4: // unit is healer
                            isDown = 1;
                            this.getMoveOptions(currTile, 4);
                            return currTile;
                        default:
                            break;
                    }
                }
            } 
        } 
    },

    // calculates possible movement
    getMoveOptions : function(currTile, unitType) {
        attackTiles = [];
        var adjacent = [];
        var x = currTile.x;
        var y = currTile.y;

        //0 for fighters, 1 for other
        var attackRange; 

        switch (unitType) {
            case 1:
                max = 4;
                attackRange = 0;
                break;
            case 2:
                max = 6;
                attackRange = 1;
                break;
            case 3:
                max = 5;
                attackRange = 1;
                break;
            case 4:
                max = 6;
                attackRange = 1;
            default:
                break;
        }

        //Breadth-first Search Algorithm for finding appropriate tiles
        var queue = [];
        var set = [];
        var tile;
        var distance;

        queue.push(currTile);
        set.push(currTile);

        while (queue.length > 0) {
            tile = queue.shift();
            adjacent = [];
            distance = Math.abs(tile.x-currTile.x) + Math.abs(tile.y-currTile.y);
            // check if within the maximum allowed movement
            if (distance >= max)
                break;

            adjacent = this.getAdjacent(tile);

            for (var i = 0; i < adjacent.length; i++) {
                if (adjacent[i] != null) {
                    if (distance < max) {
                        if (set.indexOf(adjacent[i]) == -1) {
                            adjacent[i].distance = distance;
                            set.push(adjacent[i]);
                            queue.push(adjacent[i]);
                        }
                    }
                }
            }
        }

        switch(currTile.unit.name){
            case("Friendly Fighter"):
                attackTiles = this.getAdjacent(currTile);
                break;
            case("Friendly Archer"):
                tile = map.getTile(x+1, y);
                if(tile){
                    adjacent = this.getAdjacent(tile);
                    for(var i = 0; i<adjacent.length; i++)
                        attackTiles.push(adjacent[i]);    
                }

                tile = map.getTile(x-1, y);
                if(tile){
                    adjacent = this.getAdjacent(tile);
                    for(var i = 0; i<adjacent.length; i++)
                        attackTiles.push(adjacent[i]);    
                }

                tile = map.getTile(x, y+1);
                if(tile){
                    adjacent = this.getAdjacent(tile);
                    for(var i = 0; i<adjacent.length; i++)
                        attackTiles.push(adjacent[i]); 
                }

                tile = map.getTile(x, y-1);
                if(tile){
                    adjacent = this.getAdjacent(tile);
                    for(var i = 0; i<adjacent.length; i++)
                        attackTiles.push(adjacent[i]);  
                } 
                break;
            case("Friendly Mage"):
                attackTiles = this.getAdjacent(currTile);

                tile = map.getTile(x+1, y+1);
                if(tile)
                    attackTiles.push(tile);

                tile = map.getTile(x+1, y-1);
                if(tile)
                    attackTiles.push(tile);

                tile = map.getTile(x-1, y+1);
                if(tile)
                    attackTiles.push(tile);

                tile = map.getTile(x-1, y-1);
                if(tile)
                    attackTiles.push(tile);
                break;
            case("Friendly Healer"):
                attackTiles = this.getAdjacent(currTile);
                
                tile = map.getTile(x+1, y+1);
                if(tile)
                    attackTiles.push(tile);

                tile = map.getTile(x+1, y-1);
                if(tile)
                    attackTiles.push(tile);

                tile = map.getTile(x-1, y+1);
                if(tile)
                    attackTiles.push(tile);

                tile = map.getTile(x-1, y-1);
                if(tile)
                    attackTiles.push(tile);
                break;
        }

        possibleTiles = this.drawOptions(set, currTile.unit);
    },

    getAdjacent : function(currTile) {
        var adjacent = [];
        var x = currTile.x;
        var y = currTile.y;
        var i = background.index;

        var right = map.getTileRight(i,x,y);
        var left = map.getTileLeft(i,x,y);
        var above = map.getTileAbove(i,x,y);
        var below = map.getTileBelow(i,x,y);

        if (right && right.index != -1)
            adjacent.push(right);

        if (left && left.index != -1)
            adjacent.push(left);

        if (above && above.index != -1)
            adjacent.push(above);

        if (below && below.index != -1)
            adjacent.push(below);

        return adjacent;
    },

    // overlay possible movement for selected unit
    drawOptions : function(possibleTiles, unit) {
        graphics = game.add.graphics();
        for (var j = 0; j < attackTiles.length; j++) {
            if(unit.name != "Friendly Healer"){
                if (enemyUnits.indexOf(attackTiles[j].unit) != -1) {
                    graphics.lineStyle(2, 0xff0000, .5);
                    graphics.beginFill(0xff0000, .5);
                    graphics.drawRect(attackTiles[j].worldX + 2, attackTiles[j].worldY + 2, 56, 56);
                }
            }
            else{
                if (friendlyUnits.indexOf(attackTiles[j].unit) != -1 && attackTiles[j].unit != unit) {
                    graphics.lineStyle(2, 0x33ff33, .5);
                    graphics.beginFill(0x33ff33, .5);
                    graphics.drawRect(attackTiles[j].worldX + 2, attackTiles[j].worldY + 2, 56, 56);
                }
            }
        }

        for (var j = 0; j < possibleTiles.length; j++) {
            if (possibleTiles[j] != null) {
                if (possibleTiles[j].unit == null) {
                    // draw some spiffy looking blue squares for possible movement
                    graphics.lineStyle(2, 0x0066ff, .5); 
                    graphics.beginFill(0x0066ff, .5);
                    graphics.drawRect(possibleTiles[j].worldX + 2, possibleTiles[j].worldY + 2, 56, 56);
                } 
                else { 
                    //remove impossible locations
                    possibleTiles.splice(j, 1);
                    j--;
                }
            } else {
                possibleTiles.splice(j, 1);
                j--;
            }
        }
        cursor.bringToTop();

        return possibleTiles;
    },

    // complete movement
    moveComplete : function(coordinates) {
        isDown = 0;
        var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
        var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
        var currTile = map.getTile(x,y, background);
        var oldTile = map.getTile(coordinates[0], coordinates[1], background);

        if (possibleTiles.indexOf(currTile) != -1) {
            var distance = Math.abs(oldTile.x-currTile.x) + Math.abs(oldTile.y-currTile.y);
            if (!oldTile.unit.locked) {
                var strReq;
                moveRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
                moveRequest.unit_id = oldTile.unit.id;
                moveRequest.x = x;
                moveRequest.y = y;

                strReq = JSON.stringify(moveRequest);
                connection.send(strReq);

                    // set the unit's location to new tile
                    oldTile.unit.x = currTile.worldX;
                    oldTile.unit.y = currTile.worldY;
                    currTile.unit = oldTile.unit;

                    // give the new tile all of the old tile's properties
                    currTile.properties.unitType = oldTile.properties.unitType;
                    oldTile.properties.unitType = 0;
                    oldTile.unit = null;

                    this.updateBar(currTile.unit.id, currTile.unit.x, currTile.unit.y, false);
                    // show the user that this unit is now locked, and cannot be moved again
                    //if(distance>=max){
                        this.lockUnit(currTile.unit);

                        lockRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
                        lockRequest.unit_id = currTile.unit.id;

                        strReq = JSON.stringify(lockRequest);
                        connection.send(strReq);
                    //}
            }
        } else if (attackTiles.indexOf(currTile) != -1)
            this.attack(oldTile, currTile);

        graphics.clear();
    },

    hpBarsHit : function(targetId, targetHp, unitId, unitHp){
        if(turn == playerId){
            if(friendlyUnits[unitId].name != "Friendly Healer"){
                hBars[unitId].setPercent(unitHp);
                friendlyUnits[unitId].health = unitHp;
                enemyHBars[targetId].setPercent(targetHp);
                enemyUnits[targetId].health = targetHp;
            }
            else{
                hBars[targetId].setPercent(targetHp);
                friendlyUnits[targetId].health = targetHp;
            }
        }
        else{
            if(enemyUnits[unitId].name != "Enemy Healer"){
                hBars[targetId].setPercent(targetHp);
                friendlyUnits[targetId].health = targetHp;
                enemyHBars[unitId].setPercent(unitHp);
                enemyUnits[unitId].health = unitHp;
            }
            else{
                enemyHBars[targetId].setPercent(targetHp);
                enemyUnits[targetId].health = targetHp;   
            }
        }
    },

    attack : function(oldTile, currTile) {
        var selectedUnit = oldTile.unit;
        var targetedUnit = currTile.unit;
        var strReq;

        attackRequest.unit_id = selectedUnit.id;
        attackRequest.target_id = targetedUnit.id;
        strReq = JSON.stringify(attackRequest);
        console.log(strReq);
        connection.send(strReq);

        // if (selectedUnit && targetedUnit) 
        //     this.lockUnit(oldTile.unit); 
    },

    killUnit : function(enemyOrFriendly, unitId){
        var x;
        var y;
        var unit;
        var tile;

        if(turn == playerId){
            if(enemyOrFriendly){
                unit = enemyUnits[unitId];
                x = game.math.snapToFloor(Math.floor(unit.x), 60) / 60;
                y = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
                tile = map.getTile(x,y);

                unit.kill();
                tile.unit = null;
                tile.properties.unitType = 0;
                enemyUnits[unitId] = dummyUnit;
                enemyHBars[unitId].destroy();
                enemyCount--;
            }
            else{
                unit = friendlyUnits[unitId];
                x = game.math.snapToFloor(Math.floor(unit.x), 60) / 60;
                y = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
                tile = map.getTile(x,y);

                unit.kill();
                tile.unit = null;
                tile.properties.unitType = 0;
                friendlyUnits[unitId] = dummyUnit;
                hBars[unitId].destroy();
                friendCount--;
            }
        }
        else{
            if(enemyOrFriendly){
                unit = friendlyUnits[unitId];
                x = game.math.snapToFloor(Math.floor(unit.x), 60) / 60;
                y = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
                tile = map.getTile(x,y);

                unit.kill();
                tile.unit = null;
                tile.properties.unitType = 0;
                friendlyUnits[unitId] = dummyUnit;
                hBars[unitId].destroy();
                friendCount--;
            }
            else{
                unit = enemyUnits[unitId];
                x = game.math.snapToFloor(Math.floor(unit.x), 60) / 60;
                y = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
                tile = map.getTile(x,y);

                unit.kill();
                tile.unit = null;
                tile.properties.unitType = 0;
                enemyUnits[unitId] = dummyUnit;
                enemyHBars[unitId].destroy();
                enemyCount--;
            }
        }

        if(enemyCount == 0){
            game.win = true;
            this.state.start('GameOver');
        }
        if(friendCount == 0){
            game.win = false;
            this.state.start('GameOver');
        }
    },

    lockUnit : function(unit) {
        // get the tile the unit is on.
        var x = game.math.snapToFloor(Math.floor(unit.x), 60) / 60; 
        var y = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
        var currTile = map.getTile(x, y, background);

        if(!currTile.unit.locked){
            currTile.unit.locked = true;

            // draw a dark red square over the unit
            lockGraphics.lineStyle(2, 0x4d4d4d, 1); 
            lockGraphics.beginFill(0x4d4d4d, .5);
            lockGraphics.drawRect(currTile.worldX + 2, currTile.worldY + 2, 56, 56);

            // increment the number of locked units (in place of turns)
            lockCounter++; 

            // if the the lock counter == total number of units, unlock all
            // TODO replace this with turn mechanism
            if (lockCounter == friendlyUnits.length + enemyUnits.length) {
                this.unlockUnits(friendlyUnits);
                this.unlockUnits(enemyUnits);
                lockCounter = 0;
            }
        }
    },

    unlockUnits : function(unitList) {
        for (var i = 0; i < unitList.length; i++) {
            unitList[i].locked = false;
        }
        lockGraphics.clear();
    },


    pauseGame : function() {
        if (!pause) {
            var x = game.camera.x;
            var y = game.camera.y;

            option = game.add.sprite(0,0, 'option');
            option.fixedToCamera=true;
            arrow = game.add.sprite(x+315, y+305, 'arrow');
            pause = true;
        } else {
            option.destroy();
            arrow.destroy();
            pause = false;
        }
    },

    //upon receiving an event from the server, the oppenent's unit is moved
    opponentMove : function(unitId, x, y) {
        var oldTile;
        var newTile;
        var oldX;
        var oldY;
        var unit;
        var newX = x;
        var newY = y;

        for(var i = 0; i<enemyUnits.length; i++){
            unit = enemyUnits[i];
            if((unit.id == unitId) && (unit.owner == turn)){
                oldX = game.math.snapToFloor(Math.floor(unit.x), 60) / 60;
                oldY = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
                newTile = map.getTile(newX, newY, background);
                oldTile = map.getTile(oldX, oldY, background);

                oldTile.unit.x = newTile.worldX;
                oldTile.unit.y = newTile.worldY;
                newTile.unit = oldTile.unit;

                // give the new tile all of the old tile's properties
                newTile.properties.unitType = oldTile.properties.unitType;
                oldTile.properties.unitType = 0;
                oldTile.unit = null;

                this.updateBar(unitId, newTile.unit.x, newTile.unit.y, true);
            }
        } 
    },

    notifyTurnChange : function(turn){
        if(playerTurn){
            if(turn == playerId)
                playerTurn.text = playerId + " - " + username._text;
            else
                playerTurn.text = turn + " - " + opponentName;
        }  
    } 
};