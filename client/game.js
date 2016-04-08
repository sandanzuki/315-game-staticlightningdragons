//var connection = new WebSocket("ws://sld.bitwisehero.com:13337", "rqs");
//connection.onmessage = function(yas) { console.log(yas); }(edited)
//conection.send(JSON STUFF AS A STRING)
//^^^^
//this is is stuff for connecting to server

var game = game || {},
    map,
    background,
    graphics,
    blocked;
    var GRAVITY = 900;

game = new Phaser.Game(900, 660, Phaser.AUTO,'', { preload: preload, create: create, update: update });

var cursor,
    tileX,
    tileY,
    bFighter1, bFighter2, bArcher1, bArcher2, bMage, //all the global variables
    rFighter1, rFighter2, rArcher1, rArcher2, rMage,
    possibleTiles = [],
    attackTiles = [],
    coordinates = [],
    isDown,
    graphics,
    lockGraphics,
    selected,
    lockCounter = 0;

var friendlyUnits = [],
    enemyUnits = [];

function preload() {
	// load map
	game.load.tilemap('Map', 'MediaAssets/tileMaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('gameTiles', 'MediaAssets/mapTiles.png');

    // blue units
    game.load.image('b_archer', 'MediaAssets/b_archer.png');
    game.load.image('b_mage', 'MediaAssets/b_mage.png');
    game.load.image('b_fighter', 'MediaAssets/b_fighter.png');

	// red units
	game.load.image('r_archer', 'MediaAssets/r_archer.png');
	game.load.image('r_mage', 'MediaAssets/r_mage.png');
	game.load.image('r_fighter', 'MediaAssets/r_fighter.png');
}


function create() {
    //this.physics.startSystem(Phaser.Physics.ARCADE);
    //this.physics.arcade.gravity.y = GRAVITY;
	// show map
	isDown = 0;
	game.scale.pageAlignHorizontally = true; // aligns canvas
	game.scale.pageAlignVertically = true; // aligns canvas
	game.scale.refresh();
    //game.stage.backgroundColor = "#000000";
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
    //background.position.set(window.innerWidth, window.innerHeight);

    blocked.fixedToCamera = false;
    blocked.scrollFactorX = 0;
    blocked.scrollFactorY = 0;
    //blocked.position.set(window.innerWidth, window.innerHeight);

    //blocked.position.set(this.world.centerX, this.world.centerY);

    loadUnits();

    lockGraphics = game.add.graphics();//used to identify a locked unit
    selected = game.add.graphics();//used to identify the user's selected unit

    cursor = game.add.graphics();
    cursor.lineStyle(2, 0xffffff, 1);
    cursor.drawRect(1, 1, 58, 58);

	background.resizeWorld();
    game.physics.startSystem(Phaser.Physics.P2JS);

    map.setCollisionBetween(1, 2000, true, 'blockedLayer'); //need to figure out how to set 'collisions' between cursor and blocked layer
    // game.physics.p2.enable(cursor);                         //which includes the walls and water
 	// cursor.body.fixedRotation = true;

	cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    enterButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);


    downButton.onDown.add(cursorDown, this);
    // if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {

    //         //game.time.events.add(Phaser.Timer.SECOND * 3000, cursorDown(), this);

    //     cursorDown();
    //     //cursor.y +=4;
    // }
    upButton.onDown.add(cursorUp, this);
    leftButton.onDown.add(cursorLeft, this);
    rightButton.onDown.add(cursorRight, this);
    pauseButton.onDown.add(pauseGame, this);

    enterButton.onDown.add(choosingMove, this);
}

//function for loading units to tilemap
function loadUnits(){
    // add all blue sprites to the map
    bFighter1 = game.add.sprite(0, 0,'b_fighter');
    friendlyUnits.push(bFighter1);                  //information about the unit and its tile for movment
    map.getTileWorldXY(0,0).properties.unitType = 1;//Is the unit done moving this turn?
    map.getTileWorldXY(0,0).unit = bFighter1;       //Does a tile have a unit on it?
    bFighter1.maxHealth=100;

    bFighter2 = game.add.sprite(360, 240,'b_fighter');
    friendlyUnits.push(bFighter2);
    map.getTileWorldXY(360,240).properties.unitType = 1;
    map.getTileWorldXY(360,240).unit = bFighter2;

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

    // add all red sprites
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
        enemyUnits[i].maxHealth = 100;
        enemyUnits[i].locked = false;
    }
}

// functions for moving the cursor around one tile at a time
function cursorDown() {
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; //finds the x,y coorinates of the tile the cursor is sitting on
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

function cursorUp() {
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; //finds the x,y coorinates of the tile the cursor is sitting on
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

function cursorLeft() {
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; //finds the x,y coorinates of the tile the cursor is sitting on
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

function cursorRight() {
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60; //finds the x,y coorinates of the tile the cursor is sitting on
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

//function that decides the actual functionality of pressing 'enter'
function choosingMove(){
    if (document.getElementById("stats").childNodes.length != 0){//remove the text below the game screen
        document.getElementById("stats").innerHTML = "";
    }

    if(isDown == 0){
        oldTile = moveMenu();
    }
    else{
        selected.clear();
        moveComplete(coordinates);
    }
}

//function that decides on which unit is actually moving
function moveMenu() {
    coordinates = [];
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
    var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;

    coordinates[0] = x;//because phaser is being dumb and wont let me do someTile = tile
    coordinates[1] = y;//so saved the x,y coords in an array for my convienience.

    var currTile = map.getTile(x,y, background);

    //the nexted ifs get a little hairy here.
    if(currTile != null){//is the current tile actually a valid tile on the map?
        if(currTile.properties.unitType != 0){ //if the tile actually holds a unit, carry on
            if(currTile.unit.locked==false){ //if the unit is not locked, figure out what kind it is

                selected.lineStyle(2, 0xffbf00, 1); //draw a spiffy looking gold square
                selected.beginFill(0xffbf00, .5);   //to rep the selected unit
                selected.drawRect(currTile.worldX + 2, currTile.worldY + 2, 56, 56);
                possibleTiles = [];

                switch(currTile.properties.unitType){
                    case 1: //the unit is a fighter
                        isDown = 1;
                        output("Friendly Fighter");
                        getMoveOptions(currTile, 1);
                        return currTile;
                        break;
                    case 2: //the unit is an archer
                        isDown = 1;
                        output("Friendly Archer");
                        getMoveOptions(currTile, 2);
                        return currTile;
                        break;
                    case 3: //the unit is a mage
                        isDown = 1;
                        output("Friendly Mage");
                        getMoveOptions(currTile, 3);
                        return currTile;
                        break;
                    default:
                        break;
                }
            }
        }
        else{
            output("No Unit Here");
        }
    }
    else{
        output("Invalid Tile Selection");
    }
}

//calculates possible tiles for a fighter
function getMoveOptions(currTile, unitType){
    attackTiles = [];
    var adjacent = [];

    var queue1 = [];
    var queue2 = [];

    var x = currTile.x;
    var y = currTile.y;
    var moves = 5; //designates the max possible range of movement

    queue1.push(currTile);
    queue1.push.apply(queue1, getAdjacent(currTile));

    console.log(possibleTiles.length);

    for(var i = 1; i<=5; i++){
        for(var j = 0; j<queue1.length; j++){
            currTile = queue1.shift();
            adjacent = getAdjacent(currTile);

            if(queue2.indexOf(currTile) == -1){
                queue2.push(currTile);
            }

            for(var k = 0; k<adjacent.length; k++){
                if(queue2.indexOf(adjacent[k]) == -1){
                    queue2.push(adjacent[k]);
                }
            }
            //queue2.push.apply(queue2, adjacent);
        }

        //queue1.push.apply(queue1, queue2);
        for(var j = 0; j<queue2.length; j++){
            queue1.push(queue2[j]);
        }
        queue2 = [];
    }

    //queue1;


    possibleTiles = drawOptions(queue1);
    // for(var n=1; n<6; n++){//tiles to the right
    //     possibleTiles.push(map.getTile(x+n, y, background));

    //     if(map.getTileRight(i, x+n, y) != null){//prevent unit from moving through blocked tiles
    //         if(map.getTileRight(i, x+n, y).index == -1){
    //             break;
    //         }
    //     }
    // }

    // for(var n=1; n<6; n++){//tiles to the left
    //     possibleTiles.push(map.getTile(x-n,y,background));

    //     if(map.getTileLeft(i, x-n, y) != null){
    //         if(map.getTileLeft(i, x-n, y).index == -1){
    //             break;
    //         }
    //     }
    // }

    // for(var n=1; n<6; n++){//tiles above
    //     possibleTiles.push(map.getTile(x,y-n,background));

    //     if(map.getTileAbove(i, x, y-n) != null){
    //         if(map.getTileAbove(i, x, y-n).index == -1){
    //             break;
    //         }
    //     }
    // }

    // for(var n=1; n<6; n++){//tiles below
    //     possibleTiles.push(map.getTile(x,y+n,background));

    //     if(map.getTileBelow(i, x, y+n) != null){
    //         if(map.getTileBelow(i, x, y+n).index == -1){
    //             break;
    //         }
    //     }
    // }

    // var k = 4;
    // for(var n=1; n<5; n++){ //all tiles in a diamond shape around the x/y axis
    //     for(var m=1; m<=k; m++){
    //         possibleTiles.push(map.getTile(x+n,y-m,background));
    //         possibleTiles.push(map.getTile(x-n,y+m,background));
    //         possibleTiles.push(map.getTile(x+n,y+m,background));
    //         possibleTiles.push(map.getTile(x-n,y-m,background));
    //     }
    //     k--;
    // }

    // var m = 5; //just past the movement range
    // for(var n=1; n<6; n++){ //gathering all the possible attack tiles around the edge of movement range to color red

    //     if(unitType == 1){
    //         attackTiles.push(map.getTile(x+n, y+m, background)); //these are the tiles that will be highlighted 
    //         attackTiles.push(map.getTile(x-n, y-m, background)); //in red to designated a tile that a unit
    //         attackTiles.push(map.getTile(x+n, y-m, background)); //can attack but not actually move to
    //         attackTiles.push(map.getTile(x-n, y+m, background));
    //     }
    //     else if(unitType == 2 || unitType == 3){
    //         for(var i = 0; i<=1; i++){
    //             attackTiles.push(map.getTile(x+n, y+m+i, background)); //these are the tiles that will be highlighted 
    //             attackTiles.push(map.getTile(x-n, y-m-i, background)); //in red to designated a tile that a unit
    //             attackTiles.push(map.getTile(x+n, y-m-i, background)); //can attack but not actually move to
    //             attackTiles.push(map.getTile(x-n, y+m+i, background));
            
    //             if(n==5){
    //                 attackTiles.push(map.getTile(x+6, y+i, background));
    //                 attackTiles.push(map.getTile(x-6, y+i, background));
    //             }
    //         }
    //         if(n==1){
    //             attackTiles.push(map.getTile(x, y+6, background));
    //             attackTiles.push(map.getTile(x, y-6, background));
    //         }
    //     }
    //     m--;
    // }

    // if(unitType == 1){
    //     attackTiles.push(map.getTile(x+6, y, background));
    //     attackTiles.push(map.getTile(x-6, y, background));
    //     attackTiles.push(map.getTile(x, y+6, background));
    //     attackTiles.push(map.getTile(x, y-6, background));
    // }
    // else{
    //     attackTiles.push(map.getTile(x+6, y-1, background));
    //     attackTiles.push(map.getTile(x-6, y-1, background));
    // }
    
    // possibleTiles = drawOptions(possibleTiles);
}

function getAdjacent(currTile){
    var adjacent = [];
    var x = currTile.x;
    var y = currTile.y;
    var i = background.index;

    var right = map.getTileRight(i,x,y);
    var left = map.getTileLeft(i,x,y);
    var above = map.getTileAbove(i,x,y);
    var below = map.getTileBelow(i,x,y);

    if(right){
        adjacent.push(right);
    }

    if(left){
        adjacent.push(left);
    }

    if(above){
        adjacent.push(above);
    }

    if(below){
        adjacent.push(below);
    }

    return adjacent;
}

//function that actually overlays the possible movement for selected unit
function drawOptions(possibleTiles){
    graphics = game.add.graphics();
    for(var j=0; j<possibleTiles.length; j++){
        if(possibleTiles[j]!=null){
            if(possibleTiles[j].unit == null){
                graphics.lineStyle(2, 0x0066ff, 1); //draw some spiffy looking blue squares for possible movement
                graphics.beginFill(0x0066ff, .5);
                graphics.drawRect(possibleTiles[j].worldX + 2, possibleTiles[j].worldY + 2, 56, 56);
            }
            else{//removes impossible tile locations
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
            graphics.lineStyle(2, 0xff0000, 1); //draw some spiffy looking blue squares for possible movement
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

//function that completes the movement of the unit
function moveComplete(coordinates){
    isDown = 0;
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
    var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
    var currTile = map.getTile(x,y, background);
    var oldTile = map.getTile(coordinates[0], coordinates[1], background);

    if(possibleTiles.indexOf(currTile) != -1){
        if(!oldTile.unit.locked){
            oldTile.unit.x = currTile.worldX; //set the unit's location to new tile
            oldTile.unit.y = currTile.worldY;
            currTile.unit = oldTile.unit;
            currTile.properties.unitType = oldTile.properties.unitType; //give the new tile all of the old tile's properties
            oldTile.properties.unitType = 0;
            oldTile.unit = null;

            lockUnit(currTile.unit);//show the user that this unit is now locked, and cannot be moved again
        }
    }
    graphics.clear();

}

function lockUnit(unit){
    var x = game.math.snapToFloor(Math.floor(unit.x), 60) / 60; //get the tile the unit is on.
    var y = game.math.snapToFloor(Math.floor(unit.y), 60) / 60;
    var currTile = map.getTile(x, y, background);

    currTile.unit.locked = true;

    lockGraphics.lineStyle(2, 0xcc0000, 1); //draw a dark red square over the unit
    lockGraphics.beginFill(0xcc0000, .25);
    lockGraphics.drawRect(currTile.worldX + 2, currTile.worldY + 2, 56, 56);
    lockCounter++; //increment the number of locked units (in place of turns)

    if(lockCounter == friendlyUnits.length + enemyUnits.length){ //if the the lock counter == total number of units, unlock all
        unlockUnits(friendlyUnits);                              //this will be replaced with the turn mechanism
        unlockUnits(enemyUnits);
        lockCounter = 0;
    }
}

function unlockUnits(unitList){
    for(var i = 0; i<unitList.length; i++){
        unitList[i].locked = false;
    }
    lockGraphics.clear();
}

function output(input){ //just used to output helpful info to screen
    document.getElementById("stats").innerHTML = input;
}

var pause = false;
function pauseGame() {
   // if (pause == false)

}

