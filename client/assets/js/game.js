var game = game || {},
    map,
    option,
    arrow,
    background,
    graphics,
    blocked,
    GRAVITY = 900,
    cursor,
    tileX,
    tileY,
    bFighter1, bFighter2, bArcher1, bArcher2, bMage, 
    rFighter1, rFighter2, rArcher1, rArcher2, rMage,
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
    pause = false;

window.loadUnits = function() { 
    // function for loading units to tilemap
    // add all blue sprites to the map
    bFighter1 = game.add.sprite(0, 0,'b_fighter');
    friendlyUnits.push(bFighter1); 
    map.getTileWorldXY(0,0).properties.unitType = 1; 
    map.getTileWorldXY(0,0).unit = bFighter1; 
    bFighter1.maxHealth=100;

    bFighter2 = game.add.sprite(0, 240,'b_fighter');
    friendlyUnits.push(bFighter2);
    map.getTileWorldXY(0,240).properties.unitType = 1;
    map.getTileWorldXY(0,240).unit = bFighter2;

    bArcher1 = game.add.sprite(0, 60,'b_archer');
    friendlyUnits.push(bArcher1);
    map.getTileWorldXY(0, 60).properties.unitType = 2;
    map.getTileWorldXY(0, 60).unit = bArcher1;

    bArcher2 = game.add.sprite(0, 180,'b_archer');
    friendlyUnits.push(bArcher2);
    map.getTileWorldXY(0, 180).properties.unitType = 2;
    map.getTileWorldXY(0, 180).unit = bArcher2;

    bMage = game.add.sprite(0, 120,'b_mage');
    friendlyUnits.push(bMage);
    map.getTileWorldXY(0, 120).properties.unitType = 3;
    map.getTileWorldXY(0, 120).unit = bMage;


    // add all red sprites to the map
    var x = map.widthInPixels-60;
    rFighter1 = game.add.sprite(x, 180, 'r_fighter');
    enemyUnits.push(rFighter1);
    map.getTileWorldXY(x, 180).properties.unitType = 1;
    map.getTileWorldXY(x, 180).unit = rFighter1;

    rFighter2 = game.add.sprite(x, 420, 'r_fighter');
    enemyUnits.push(rFighter2);
    map.getTileWorldXY(x, 420).properties.unitType = 1;
    map.getTileWorldXY(x, 420).unit = rFighter2;

    rArcher1 = game.add.sprite(x, 240, 'r_archer');
    enemyUnits.push(rArcher1);
    map.getTileWorldXY(x, 240).properties.unitType = 2
        map.getTileWorldXY(x, 240).unit = rArcher1;

    rArcher2 = game.add.sprite(x, 360, 'r_archer');
    enemyUnits.push(rArcher2);
    map.getTileWorldXY(x, 360).properties.unitType = 2;
    map.getTileWorldXY(x, 360).unit = rArcher2;

    rMage = game.add.sprite(x, 300, 'r_mage');
    enemyUnits.push(rMage);
    map.getTileWorldXY(x, 300).properties.unitType = 3;
    map.getTileWorldXY(x, 300).unit = rMage;

    for(var i = 0; i<friendlyUnits.length; i++){
        friendlyUnits[i].maxHealth = 100;
        friendlyUnits[i].locked = false;
        friendlyUnits[i].friendly = true;
        enemyUnits[i].maxHealth = 100;
        enemyUnits[i].locked = false;
        enemyUnits[i].friendly = false;
    }
}

// move the cursor around one tile at a time
window.cursorDown = function() { 
    if(!pause){
        // finds the x,y coorinates of the tile the cursor is sitting on
        var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
        var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
        var i = background.index;
        var nextTile;

        if(y == map.height - 1)
            nextTile = map.getTileAbove(i, x, 1);
        else
            nextTile = map.getTileBelow(i, x, y);

        cursor.x = nextTile.worldX;
        cursor.y = nextTile.worldY;
    }
    else{
        if(arrow.y + 60 > 440)
            arrow.y = 320;
        else
            arrow.y += 60;

        switch(arrow.y){
            case(320):
                arrow.x = 330;
                break;

            case(380):
                arrow.x = 360;
                break;

            case(440):
                arrow.x = 350;
                break;

            default:
                break;
        }
    }
}


window.cursorUp = function() {
    if(!pause){
        var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
        var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
        var i = background.index;
        var nextTile;

        if(y == 0)
            nextTile = map.getTileBelow(i, x, 8);
        else
            nextTile = map.getTileAbove(i, x, y);

        cursor.x = nextTile.worldX;
        cursor.y = nextTile.worldY;
    }
    else{
        if(arrow.y - 60<320)
            arrow.y = 440;
        else
            arrow.y -= 60;
        

        switch(arrow.y){
            case(320):
                arrow.x = 330;
                break;

            case(380):
                arrow.x = 360;
                break;

            case(440):
                arrow.x = 350;
                break;

            default:
                break;
        }
    }
}


window.cursorLeft = function() {
    if(!pause){
        var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
        var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
        var i = background.index;
        var nextTile;

        if(x == 0)
            nextTile = map.getTileRight(i, 13, y);
        else
            nextTile = map.getTileLeft(i, x, y);

        cursor.x = nextTile.worldX;
        cursor.y = nextTile.worldY;
    }
}


window.cursorRight = function() {
    if(!pause){
        var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; 
        var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
        var i = background.index;
        var nextTile;

        if(x == map.width-1)
            nextTile = map.getTileLeft(i, 1, y);
        else
            nextTile = map.getTileRight(i, x, y);

        cursor.x = nextTile.worldX;
        cursor.y = nextTile.worldY;
    }
}


// function that decides the actual functionality of pressing 'enter'
window.choosingMove = function(){
    if(!pause){
        // remove the text below the game screen
        if (document.getElementById("stats").childNodes.length != 0)
            output("");
        

        if(isDown == 0)
            oldTile = moveMenu();
        else{
            selected.clear();
            moveComplete(coordinates);
        }
    }
    else{
        switch(arrow.y){
            case(320):
                output("Resumed");
                pause = false;
                option.destroy();
                arrow.destroy();
                break;

            case(380):
                output("Opened settings menu");
                break;

            case(440):
                output("");
                pause = false;
                this.state.start('GameOver');
                break;

            default:
                break;
        }
    }
}


// function that decides on which unit is actually moving
window.moveMenu = function() {
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
            if (currTile.unit.locked == false) { // if the unit is not locked, figure out what kind it is

                // draw a spiffy looking gold square to represent a selected unit
                selected.lineStyle(2, 0xffbf00, 1);
                selected.beginFill(0xffbf00, .5);
                selected.drawRect(currTile.worldX + 2, currTile.worldY + 2, 56, 56);
                possibleTiles = [];

                switch (currTile.properties.unitType) {
                    case 1: // unit is fighter
                        isDown = 1;
                        output("Friendly Fighter");
                        getMoveOptions(currTile, 1);
                        return currTile;
                        break;
                        
                    case 2: // unit is archer
                        isDown = 1;
                        output("Friendly Archer");
                        getMoveOptions(currTile, 2);
                        return currTile;
                        break;
                        
                    case 3: // unit is mage
                        isDown = 1;
                        output("Friendly Mage");
                        getMoveOptions(currTile, 3);
                        return currTile;
                        break;
                        
                    default:
                        break;
                }
            }
        } else
            output("No Unit Here");
    } else
        output("Invalid Tile Selection");
}


// calculates possible tiles for a fighter
window.getMoveOptions = function(currTile, unitType) {
    attackTiles = [];
    var adjacent = [];
    var x = currTile.x;
    var y = currTile.y;
    var maxMoves;

    switch(unitType) {
        case 1:
            maxMoves = 4;
            break;

        case 2:
            maxMoves = 6;
            break;

        case 3:
            maxMoves = 5;
            break;

        default:
            break;
    }

    //Breadth-first Search Algorithm for finding appropriate tiles
    var queue = [];
    var set = [];
    var tile;

    queue.push(currTile);
    set.push(currTile);

    while (queue.length>0) {
        tile = queue.shift();
        adjacent = [];

        // check if within the maximum allowed movement
        if (Math.abs(tile.x-currTile.x) + Math.abs(tile.y-currTile.y) >= maxMoves)
            break;

        adjacent = getAdjacent(tile);

        for(var i = 0; i<adjacent.length; i++){
            if(adjacent[i] != null){
                if(set.indexOf(adjacent[i]) == -1){
                    set.push(adjacent[i]);
                    queue.push(adjacent[i]);
                }
            }
        }
    }

    possibleTiles = drawOptions(set);
}


window.getAdjacent = function(currTile) {
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
}


// function that actually overlays the possible movement for selected unit
window.drawOptions = function(possibleTiles){
    graphics = game.add.graphics();
    for(var j=0; j<possibleTiles.length; j++){
        if(possibleTiles[j]!=null){
            if(possibleTiles[j].unit == null){
                // draw some spiffy looking blue squares for possible movement
                graphics.lineStyle(2, 0x0066ff, 1); 
                graphics.beginFill(0x0066ff, .5);
                graphics.drawRect(possibleTiles[j].worldX + 2, possibleTiles[j].worldY + 2, 56, 56);
            }
            else{ //removes impossible tile locations
                if(enemyUnits.indexOf(possibleTiles[j].unit) != -1){//enemy unit is in range of movement, will implement something to do with that
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
        }
        else{
            possibleTiles.splice(j, 1);
            j--;
        }
    }
    for(var j=0; j<attackTiles.length; j++){
        if(attackTiles[j]!=null){
            // draw some spiffy looking red squares for attack range
            graphics.lineStyle(2, 0xff0000, 1);
            graphics.beginFill(0xff0000, .5);
            graphics.drawRect(attackTiles[j].worldX + 2, attackTiles[j].worldY + 2, 56, 56);
        }
        else{
            attackTiles.splice(j, 1);
            j--;
        }
    }
    return possibleTiles;
}


// complete movement
window.moveComplete = function(coordinates){
    isDown = 0;
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
    var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
    var currTile = map.getTile(x,y, background);
    var oldTile = map.getTile(coordinates[0], coordinates[1], background);

    if(possibleTiles.indexOf(currTile) != -1){
        if(!oldTile.unit.locked){
            // set the unit's location to new tile
            oldTile.unit.x = currTile.worldX;
            oldTile.unit.y = currTile.worldY;
            currTile.unit = oldTile.unit;

            // give the new tile all of the old tile's properties
            currTile.properties.unitType = oldTile.properties.unitType;
            oldTile.properties.unitType = 0;
            oldTile.unit = null;

            // show the user that this unit is now locked, and cannot be moved again
            lockUnit(currTile.unit);
        }
    }
    else if(attackTiles.indexOf(currTile) != -1){
        if(!oldTile.unit.locked){
            if(!currTile.friendly)
                attack(oldTile, currTile);
            
        }
    }
    graphics.clear();
}

window.attack = function(oldTile, currTile){
    var targetedUnit = currTile.unit;
    targetedUnit.kill();
    enemyUnits.splice(enemyUnits.indexOf(targetedUnit), 1);

    output("Killed: " + targetedUnit.name)    

    oldTile.unit.x = currTile.worldX;
    oldTile.unit.y = currTile.worldY;
    currTile.unit = oldTile.unit;

    currTile.properties.unitType = oldTile.properties.unitType; // give the new tile all of the old tile's properties
    oldTile.properties.unitType = 0;
    oldTile.unit = null;

    lockUnit(currTile.unit); // show the user that this unit is now locked, and cannot be moved again
}

window.lockUnit = function(unit){
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
        unlockUnits(friendlyUnits);
        unlockUnits(enemyUnits);
        lockCounter = 0;
    }
}


window.unlockUnits = function (unitList){
    for(var i = 0; i<unitList.length; i++){
        unitList[i].locked = false;
    }
    lockGraphics.clear();
}

// output helpful info to screen
window.output = function(input){ 
    document.getElementById("stats").innerHTML = input;
}


window.pauseGame = function() {
    output("");
    if(!pause){
        option = game.add.sprite(0,0, 'option');
        arrow = game.add.sprite(330,320, 'arrow');
        pause = true;
    }
    else{
        option.destroy();
        arrow.destroy();
        pause = false;
    }
}

// makes Alex's life easier 
window.skip = function(){
        unlockUnits(friendlyUnits);
        unlockUnits(enemyUnits);
        lockCounter = 0;
}




// main game state
// -------------------------------------------------------------------------------- 
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
        game.load.image('arrow', './assets/images/arrow.png');
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

        loadUnits();

        lockGraphics = game.add.graphics();//identify a locked unit
        selected = game.add.graphics();//identify the user's selected unit

        cursor = game.add.graphics();
        cursor.lineStyle(2, 0xffffff, 1);
        cursor.drawRect(1, 1, 58, 58);

        background.resizeWorld();
        game.physics.startSystem(Phaser.Physics.P2JS);
        map.setCollisionBetween(1, 2000, true, 'blockedLayer'); 

        cursors = game.input.keyboard.createCursorKeys();
    },

    update : function() {
        downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        skipButton = game.input.keyboard.addKey(Phaser.Keyboard.S);

        downButton.onDown.add(cursorDown, this);
        upButton.onDown.add(cursorUp, this);
        leftButton.onDown.add(cursorLeft, this);
        rightButton.onDown.add(cursorRight, this);
        enterButton.onDown.add(choosingMove, this);
        pauseButton.onDown.add(pauseGame, this);
        skipButton.onDown.add(skip, this);
    }
};

