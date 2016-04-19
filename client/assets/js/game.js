var map,
    option,
    arrow,
    background,
    graphics,
    blocked,
    GRAVITY = 900,
    cursor,
    bFighter, bArcher, bMage, bHealer,
    rFighter, rArcher, rMage, rHealer,
    possibleTiles = [],
    attackTiles = [],
    coordinates = [],
    isDown,
    graphics,
    lockGraphics,
    selected,
    lockCounter = 0,
    friendlyUnits = [],
    enemyUnits = [],
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
        animationDuration: 800,
        flipped: false 
    };

window.my_hit2 = function() { this.myHealthBar2.setPercent(0); } // healthbar


var Game = { 
    preload : function() {
         // load map
        game.load.tilemap('Map', './assets/js/map1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', './assets/images/mapTiles.png');

        // blue units
        game.load.image('b_archer', './assets/images/b_archer.png');
        game.load.image('b_mage', './assets/images/b_mage.png');
        game.load.image('b_fighter', './assets/images/b_fighter.png');

        //red units
        game.load.image('r_archer', './assets/images/r_archer.png');
        game.load.image('r_mage', './assets/images/r_mage.png');
        game.load.image('r_fighter', './assets/images/r_fighter.png');

        game.load.image('option', './assets/images/option.png');
        game.load.image('arrow', './assets/images/arrow_white.png');

        //load bg music here.. must load in this game state!
        game.load.audio('battle', './assets/audio/music/battle.m4a');
    },

    create : function() {
        // show map
        isDown = 0;
        game.scale.pageAlignHorizontally = true; // aligns canvas
        game.scale.pageAlignVertically = true; // aligns canvas
        game.scale.refresh();
        map = game.add.tilemap('Map');

        // building the map as intended in Tiled
        map.addTilesetImage('mapTiles', 'gameTiles');

        // create layers
        background = map.createLayer('backgroundLayer');
        blocked = map.createLayer('blockedLayer');

        // position layers
        background.fixedToCamera = false;
        background.scrollFactorX = 0;
        background.scrollFactorY = 0;

        blocked.fixedToCamera = false;
        blocked.scrollFactorX = 0;
        blocked.scrollFactorY = 0;

        // healthbar 
        // please leave comments alone!
        // --------------------------------------------------------------------------------
        this.myHealthBar = new HealthBar(this.game, hb_cnfg);
        this.myHealthBar2 = new HealthBar(this.game, hb_cnfg);
        this.myHealthBar3 = new HealthBar(this.game, hb_cnfg);
        this.myHealthBar4 = new HealthBar(this.game, hb_cnfg);
        this.myHealthBar5 = new HealthBar(this.game, hb_cnfg);

        this.myHealthBar.setPosition(30, 0); 
        this.myHealthBar2.setPosition(30, 62); 
        this.myHealthBar3.setPosition(30, 123); 
        this.myHealthBar4.setPosition(30, 183); 
        this.myHealthBar5.setPosition(30, 243); 

        returnA = game.input.keyboard.addKey(Phaser.Keyboard.A);
        returnA.onDown.add(this.my_hit, this); 

        returnB = game.input.keyboard.addKey(Phaser.Keyboard.B);
        returnB.onDown.add(this.do_hit, this); //  'this' limits function 'my_hit2' in scope of var Game
        // --------------------------------------------------------------------------------

        //bg music can go here when ready
        //battle_music = game.add.audio('battle');
        //battle_music.loopFull();

        this.loadUnits();

        lockGraphics = game.add.graphics();//identify a locked unit
        selected = game.add.graphics();//identify the user's selected unit

        cursor = game.add.graphics();
        cursor.lineStyle(2, 0xffffff, 1);
        
        if(playerId == 1)
            cursor.drawRect(1, 1, 58, 58);
        else if(playerId == 2){
            var x = map.widthInPixels-59;
            var y = map.heightInPixels-179;
            cursor.drawRect(1, 1, 58, 58);
            cursor.x = x;
            cursor.y = y;
        }

        background.resizeWorld();
        game.physics.startSystem(Phaser.Physics.P2JS);
        map.setCollisionBetween(1, 2000, true, 'blockedLayer');

        moveRequest.game_id = gameId;
        moveRequest.request_id = 49;
        moveRequest.type = "UnitMoveRequest"; 
        moveRequest.unit_id;
        moveRequest.x;
        moveRequest.y;

        attackRequest.game_id = gameId;
        attackRequest.request_id = 50;
        attackRequest.type = "UnitInteractRequest";
        attackRequest.unit_id;
        attackRequest.target_id;
    },

    update : function() {
        downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        skipButton = game.input.keyboard.addKey(Phaser.Keyboard.S);

        downButton.onDown.add(this.cursorDown, this);
        upButton.onDown.add(this.cursorUp, this);
        leftButton.onDown.add(this.cursorLeft, this);
        rightButton.onDown.add(this.cursorRight, this);
        enterButton.onDown.add(this.choosingMove, this);
        pauseButton.onDown.add(this.pauseGame, this);
        skipButton.onDown.add(this.skip, this);
    },


    // time 
    // please leave comments alone!
    // --------------------------------------------------------------------------------
    render : function() {
        game.debug.text("Time until event: " + game.time.events.duration, 32, 32);
    },
    // --------------------------------------------------------------------------------

    // healthbar
    // please leave comments alone!
    // --------------------------------------------------------------------------------
    do_hit : function() { game.time.events.add( Phaser.Timer.SECOND * 4, my_hit2, this); },
    my_hit : function() { this.myHealthBar.setPercent(30); },
    // --------------------------------------------------------------------------------


    // load units onto tilemap
    loadUnits : function() {
        var blueX, blueY,
            redX, redY;
        switch(playerId){
            case(1):
                blueX = 0;
                blueY = 0;
                redX = map.widthInPixels-60;
                redY = 180;
                break;
            case(2):
                blueX = map.widthInPixels-60;
                blueY = 180;
                redX = 0;
                redY = 0;
                break;
            default:
                break;
        }

        //add all blue sprites to the map
        for(var i = 0; i<=4; i++){
            switch(units[i]){
                case "FIGHTER":
                    bFighter = game.add.sprite(blueX, blueY,'b_fighter');
                    map.getTileWorldXY(blueX,blueY).properties.unitType = 1; 
                    map.getTileWorldXY(blueX,blueY).unit = bFighter; 
                    bFighter.maxHealth=100;
                    bFighter.name = "Friendly Fighter";
                    friendlyUnits.push(bFighter); 
                    break;
                case "ARCHER":
                    bArcher = game.add.sprite(blueX, blueY,'b_archer');
                    map.getTileWorldXY(blueX, blueY).properties.unitType = 2;
                    map.getTileWorldXY(blueX, blueY).unit = bArcher;
                    bArcher.name = "Friendly Archer";
                    friendlyUnits.push(bArcher);
                    break;
                case "MAGE":
                    bMage = game.add.sprite(blueX, blueY,'b_mage');
                    friendlyUnits.push(bMage);
                    map.getTileWorldXY(blueX, blueY).properties.unitType = 3;
                    map.getTileWorldXY(blueX, blueY).unit = bMage;
                    bMage.name = "Friendly Mage";
                    break;
                case "HEALER":
                    break;
                default:
                    break;
            }
            blueY += 60;
        }

        //add all red sprites to the map
        for(var i = 1; i<=5; i++){
            switch(otherUnits[i].type){
                case "FIGHTER":
                    rFighter = game.add.sprite(redX, redY, 'r_fighter');
                    enemyUnits.push(rFighter);
                    map.getTileWorldXY(redX, redY).properties.unitType = 1;
                    map.getTileWorldXY(redX, redY).unit = rFighter;
                    rFighter.name = "Enemy Fighter";
                    break;
                case "ARCHER":
                    rArcher = game.add.sprite(redX, redY, 'r_archer');
                    enemyUnits.push(rArcher);
                    map.getTileWorldXY(redX, redY).properties.unitType = 2
                    map.getTileWorldXY(redX, redY).unit = rArcher;
                    rArcher.name = "Enemy Archer";
                    break;
                case "MAGE":
                    rMage = game.add.sprite(redX, redY, 'r_mage');
                    enemyUnits.push(rMage);
                    map.getTileWorldXY(redX, redY).properties.unitType = 3;
                    map.getTileWorldXY(redX, redY).unit = rMage;
                    rMage.name = "Enemy Mage";
                    break;
                case "HEALER":
                    break;
                default:
                    break;
            }
            redY += 60;
        }

        for (var i = 0; i < friendlyUnits.length; i++) {
            friendlyUnits[i].maxHealth = 100;
            friendlyUnits[i].locked = false;
            friendlyUnits[i].friendly = true;
            friendlyUnits[i].id = i;
            enemyUnits[i].maxHealth = 100;
            enemyUnits[i].locked = false;
            enemyUnits[i].friendly = false;
            enemyUnits[i].id = i;
        }
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

            cursor.x = nextTile.worldX;
            cursor.y = nextTile.worldY;
        } else {
            if (arrow.y+39 > 422)
                arrow.y = 305;
            else
                arrow.y += 39;

            switch (arrow.y) {
                case(305):
                    arrow.x = 315;
                    break;

                case(344):
                    arrow.x = 280;
                    break;

                case(383):
                    arrow.x = 325;
                    break;

                case(422):
                    arrow.x = 300;
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
                nextTile = map.getTileBelow(i, x, 8);
            else
                nextTile = map.getTileAbove(i, x, y);

            cursor.x = nextTile.worldX;
            cursor.y = nextTile.worldY;
        } else {
            if (arrow.y-39 < 305)
                arrow.y = 422;
            else
                arrow.y -= 39;
            
            switch (arrow.y) {
                case(305):
                    arrow.x = 315;
                    break;

                case(344):
                    arrow.x = 280;
                    break;

                case(383):
                    arrow.x = 325;
                    break;

                case(422):
                    arrow.x = 300;
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
                nextTile = map.getTileRight(i, 13, y);
            else
                nextTile = map.getTileLeft(i, x, y);

            cursor.x = nextTile.worldX;
            cursor.y = nextTile.worldY;
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

            cursor.x = nextTile.worldX;
            cursor.y = nextTile.worldY;
        }
    },

    // functionality of 'enter'
    choosingMove : function() {
        if (!pause) {
            // remove the text below the game screen
            if (document.getElementById("stats").childNodes.length != 0)
                this.output("");
            
            if (isDown == 0)
                oldTile = this.moveMenu();
            else {
                selected.clear();
                this.moveComplete(coordinates);
            }
        } else {
            switch (arrow.y) {
                case(305):
                    this.output("Resumed");
                    pause = false;
                    option.destroy();
                    arrow.destroy();
                    break;

                case(344):
                    break;

                case(389):
                    break;

                case(422):
                    pause = false;
                    game.win = false;
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

                    this.output(currTile.unit.name);
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
                            
                        default:
                            break;
                    }
                }
            } else
                this.output("No Unit Here");
        } else
            this.output("Invalid Tile Selection");
    },

    // calculates possible movement
    getMoveOptions : function(currTile, unitType) {
        attackTiles = [];
        var adjacent = [];
        var x = currTile.x;
        var y = currTile.y;
        var max;

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

        for (var i = 0; i < set.length; i++) {
            adjacent = [];
            tile = set[i];

            if ((Math.abs(tile.x-currTile.x) + Math.abs(tile.y-currTile.y)) == max) {
                adjacent = this.getAdjacent(tile);

                for (var j = 0; j < adjacent.length; j++) {
                    if (set.indexOf(adjacent[j]) == -1 && attackTiles.indexOf(adjacent[j]) == -1)
                        attackTiles.push(adjacent[j]);
                }
            }
        }

        possibleTiles = this.drawOptions(set);
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
    drawOptions : function(possibleTiles) {
        graphics = game.add.graphics();

        for (var j = 0; j < attackTiles.length; j++) {
            if (enemyUnits.indexOf(attackTiles[j].unit) != -1) {
                // enemy unit is in range of attack
                // TODO implement something to do with that
                graphics.lineStyle(2, 0xff0000, 1);
                graphics.beginFill(0xff0000, .5);
                graphics.drawRect(attackTiles[j].worldX + 2, attackTiles[j].worldY + 2, 56, 56);
            }
        }

        for (var j = 0; j < possibleTiles.length; j++) {
            if (possibleTiles[j] != null) {
                if (possibleTiles[j].unit == null) {
                    // draw some spiffy looking blue squares for possible movement
                    graphics.lineStyle(2, 0x0066ff, 1); 
                    graphics.beginFill(0x0066ff, .5);
                    graphics.drawRect(possibleTiles[j].worldX + 2, possibleTiles[j].worldY + 2, 56, 56);
                } else { 
                    if (enemyUnits.indexOf(possibleTiles[j].unit) != -1) {
                        // enemy unit is in range of movement
                        // TODO implement something to do with that
                        graphics.lineStyle(2, 0xff0000, 1);
                        graphics.beginFill(0xff0000, .5);
                        graphics.drawRect(possibleTiles[j].worldX + 2, possibleTiles[j].worldY + 2, 56, 56);

                        attackTiles.push(possibleTiles[j]);
                    }
                    //remove impossible locations
                    possibleTiles.splice(j, 1);
                    j--;
                }
            } else {
                possibleTiles.splice(j, 1);
                j--;
            }
        }
        
        return possibleTiles;
    },

    // complete movement
    moveComplete : function(coordinates) {
        isDown = 0;
        var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
        var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
        var currTile = map.getTile(x,y, background);
        var oldTile = map.getTile(coordinates[0], coordinates[1], background);

        var strReq;
        moveRequest.request_id = Math.floor(Math.random() * (1000 - 10) + 10);
        moveRequest.unit_id = oldTile.unit.id;
        moveRequest.x = x;
        moveRequest.y = y;

        strReq = JSON.stringify(moveRequest);
        console.log(strReq);
        connection.send(strReq);

        if (possibleTiles.indexOf(currTile) != -1) {
            if (!oldTile.unit.locked) {

                // set the unit's location to new tile
                oldTile.unit.x = currTile.worldX;
                oldTile.unit.y = currTile.worldY;
                currTile.unit = oldTile.unit;

                // give the new tile all of the old tile's properties
                currTile.properties.unitType = oldTile.properties.unitType;
                oldTile.properties.unitType = 0;
                oldTile.unit = null;

                // show the user that this unit is now locked, and cannot be moved again
                this.lockUnit(currTile.unit);
            }
        } else if (attackTiles.indexOf(currTile) != -1)
            this.attack(oldTile, currTile);
        
        graphics.clear();
    },

    attack : function(oldTile, currTile) {
        var selectedUnit = oldTile.unit;
        var targetedUnit = currTile.unit;
        var strReq;

        attackRequest.unit_id = selectedUnit.id;
        attackRequest.target_id = targetedUnit.id;
        strReq = JSON.stringify(attackRequest);
        console.log(strReq);
        //connection.send(strReq);


        if (selectedUnit && targetedUnit) {
            if ((!targetedUnit.friendly && selectedUnit.friendly) || (targetedUnit.friendly && !selectedUnit.friendly)) {
                targetedUnit.kill();
                enemyUnits.splice(enemyUnits.indexOf(targetedUnit), 1);

                clang.play();
                this.output("Killed: " + targetedUnit.name)    

                oldTile.unit.x = currTile.worldX;
                oldTile.unit.y = currTile.worldY;
                currTile.unit = oldTile.unit;

                currTile.properties.unitType = oldTile.properties.unitType; // give the new tile all of the old tile's properties
                oldTile.properties.unitType = 0;
                oldTile.unit = null;

                // unit is now locked and cannot be moved again
                this.lockUnit(currTile.unit); 
            }
        } else {
            this.output("No unit to attack there");
        }
    },

    lockUnit : function(unit) {
        // get the tile the unit is on.
        var x = game.math.snapToFloor(Math.floor(unit.x), 60) / 60; 
        var y = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
        var currTile = map.getTile(x, y, background);

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
    },

    unlockUnits : function(unitList) {
        for (var i = 0; i < unitList.length; i++) {
            unitList[i].locked = false;
        }
        lockGraphics.clear();
    },

    // output helpful info to screen
    output : function(input) { 
        document.getElementById("stats").innerHTML = input;
    },

    pauseGame : function() {
        output("");
        if (!pause) {
            option = game.add.sprite(0,0, 'option');
            arrow = game.add.sprite(315,305, 'arrow');
            pause = true;
        } else {
            option.destroy();
            arrow.destroy();
            pause = false;
        }
    },

    // makes Alex's life easier 
    skip : function() {
        this.unlockUnits(friendlyUnits);
        this.unlockUnits(enemyUnits);
        lockCounter = 0;
    }
};
