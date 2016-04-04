
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
    bFighter1, bFighter2, bArcher1, bArcher2, bMage,
    rFighter1, rFighter2, rArcher1, rArcher2, rMage,
    possibleTiles = [],
    coordinates = [],
    isDown,
    graphics;


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

	// load cursor
//	game.load.image('cursor', 'MediaAssets/cursor.png');

}


function create() {
    //this.physics.startSystem(Phaser.Physics.ARCADE);
    //this.physics.arcade.gravity.y = GRAVITY;
	// show map
	isDown = 0;
	graphics = game.add.group();
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

    cursor = game.add.graphics();
    cursor.lineStyle(2, 0xffffff, 1);
    cursor.drawRect(1, 1, 58, 58);

	background.resizeWorld();
    game.physics.startSystem(Phaser.Physics.P2JS);

    map.setCollisionBetween(1, 2000, true, 'blockedLayer'); //need to figure out how to set 'collisions' between cursor and blocked layer
    // game.physics.p2.enable(cursor);                         //which includes the walls and water
 	// cursor.body.fixedRotation = true;

	cursors = game.input.keyboard.createCursorKeys();
	// cursor.body.debug = true;
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
    //calculate same x coords for all blues and reds


    // add all blue sprites to the map
    bFighter1 = game.add.sprite(0, 0,'b_fighter');
    bFighter1.locked = false;                       //information about the unit and its tile for movment
    map.getTileWorldXY(0,0).properties.unitType = 1;//Is the unit done moving this turn?
    map.getTileWorldXY(0,0).unit = bFighter1;       //Does a tile have a unit on it?

    bFighter2 = game.add.sprite(0, 240,'b_fighter');
    bFighter2.locked = false;
    map.getTileWorldXY(0,240).properties.unitType = 1;
    map.getTileWorldXY(0,240).unit = bFighter2;

    bArcher1 = game.add.sprite(0, 60,'b_archer');
    bArcher1.locked = false;
    map.getTileWorldXY(0, 60).properties.unitType = 2;
    map.getTileWorldXY(0, 60).unit = bArcher1;

    bArcher2 = game.add.sprite(0, 180,'b_archer');
    bArcher2.locked = false;
    map.getTileWorldXY(0, 180).properties.unitType = 2;
    map.getTileWorldXY(0, 180).unit = bArcher2;

    bMage = game.add.sprite(0, 120,'b_mage');
    bMage.locked = false;
    map.getTileWorldXY(0, 120).properties.unitType = 3;
    map.getTileWorldXY(0, 120).unit = bMage;

    // add all red sprites
    var x = map.widthInPixels-60;
    rFighter1 = game.add.sprite(x, 180, 'r_fighter');
    rFighter1.locked = false;
    map.getTileWorldXY(x, 180).properties.unitType = 1;
    map.getTileWorldXY(x, 180).unit = rFighter1;

    rFighter2 = game.add.sprite(x, 420, 'r_fighter');
    rFighter2.locked = false;
    map.getTileWorldXY(x, 420).properties.unitType = 1;
    map.getTileWorldXY(x, 420).unit = rFighter2;

    rArcher1 = game.add.sprite(x, 240, 'r_archer');
    rArcher1.locked = false;
    map.getTileWorldXY(x, 240).properties.unitType = 2
    map.getTileWorldXY(x, 240).unit = rArcher1;

    rArcher2 = game.add.sprite(x, 360, 'r_archer');
    rArcher2.locked = false;
    map.getTileWorldXY(x, 360).properties.unitType = 2;
    map.getTileWorldXY(x, 360).unit = rArcher2;

    rMage = game.add.sprite(x, 300, 'r_mage');
    rMage.locked = false;
    map.getTileWorldXY(x, 300).properties.unitType = 3;
    map.getTileWorldXY(x, 300).unit = rMage;
}

// functions for moving the cursor around one tile at a time
function cursorDown() {
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

function cursorUp() {
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

function cursorLeft() {
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

function cursorRight() {
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

//function that decides the actual functionality of pressing 'enter'
function choosingMove(){
    if(isDown == 0){
        oldTile = moveMenu();
    }
    else{
        moveComplete(coordinates);
    }
}

//function that decides on which unit is actually moving
function moveMenu() {
    coordinates = [];
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
    var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;

    coordinates[0] = x;
    coordinates[1] = y;

    var currTile = map.getTile(x,y, background);

    switch(currTile.properties.unitType){
        case 1:
            isDown = 1;
            fighterMoveOptions(currTile);
            return currTile;
            break;
        case 2:
            isDown = 1;
            archerMoveOptions(currTile);
            return currTile;
            break;
        case 3:
            isDown = 1;
            mageMoveOptions(currTile);
            return currTile;
            break;
        default:
            window.alert("No unit");
            break;
    }
}

//calculates possible tiles for a fighter
function fighterMoveOptions(currTile){
    possibleTiles = [];
    var x = currTile.x;
    var y = currTile.y;
    var i = background.index;

    for(var n=1; n<5; n++){//tiles to the right
        possibleTiles.push(map.getTile(x+n, y, background));

        if(map.getTileRight(i, x+n, y) != null){
            if(map.getTileRight(i, x+n, y).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<5; n++){//tiles to the left
        possibleTiles.push(map.getTile(x-n,y,background));

        if(map.getTileLeft(i, x-n, y) != null){
            if(map.getTileLeft(i, x-n, y).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<5; n++){//tiles above
        possibleTiles.push(map.getTile(x,y-n,background));

        if(map.getTileAbove(i, x, y-n) != null){
            if(map.getTileAbove(i, x, y-n).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<5; n++){//tiles below
        possibleTiles.push(map.getTile(x,y+n,background));

        if(map.getTileBelow(i, x, y+n) != null){
            if(map.getTileBelow(i, x, y+n).index == -1){
                break;
            }
        }
    }

    possibleTiles = drawOptions(possibleTiles);


}

//calculates possible tiles for an archer
function archerMoveOptions(currTile){
    possibleTiles = [];
    var x = currTile.x;
    var y = currTile.y;
    var i = background.index;

    for(var n=1; n<7; n++){
        possibleTiles.push(map.getTile(x+n, y, background));

        if(map.getTileRight(i, x+n, y) != null){
            if(map.getTileRight(i, x+n, y).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<7; n++){
        possibleTiles.push(map.getTile(x-n,y,background));

        if(map.getTileLeft(i, x-n, y) != null){
            if(map.getTileLeft(i, x-n, y).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<7; n++){
        possibleTiles.push(map.getTile(x,y-n,background));

        if(map.getTileAbove(i, x, y-n) != null){
            if(map.getTileAbove(i, x, y-n).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<7; n++){
        possibleTiles.push(map.getTile(x,y+n,background));

        if(map.getTileBelow(i, x, y+n) != null){
            if(map.getTileBelow(i, x, y+n).index == -1){
                break;
            }
        }
    }

    possibleTiles = drawOptions(possibleTiles);
}

//calculates possible tiles for a mage
function mageMoveOptions(currTile){
    possibleTiles = [];
    var x = currTile.x;
    var y = currTile.y;
    var i = background.index;

    for(var n=1; n<6; n++){
        possibleTiles.push(map.getTile(x+n, y, background));

        if(map.getTileRight(i, x+n, y) != null){
            if(map.getTileRight(i, x+n, y).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<6; n++){
        possibleTiles.push(map.getTile(x-n,y,background));

        if(map.getTileLeft(i, x-n, y) != null){
            if(map.getTileLeft(i, x-n, y).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<6; n++){
        possibleTiles.push(map.getTile(x,y-n,background));

        if(map.getTileAbove(i, x, y-n) != null){
            if(map.getTileAbove(i, x, y-n).index == -1){
                break;
            }
        }
    }

    for(var n=1; n<6; n++){
        possibleTiles.push(map.getTile(x,y+n,background));

        if(map.getTileBelow(i, x, y+n) != null){
            if(map.getTileBelow(i, x, y+n).index == -1){
                break;
            }
        }
    }

    possibleTiles = drawOptions(possibleTiles);
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
                j-=1;
            }
        }
        else{
            possibleTiles.splice(j, 1);
            j-=1;
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
            currTile.unit.locked = true; //this unit is done moving for the turn
        }
    }
    graphics.clear();
    graphics.lineStyle(2, 0xcc0000, 1);
    graphics.beginFill(0xcc0000, .25);
    graphics.drawRect(currTile.worldX + 2, currTile.worldY + 2, 56, 56);
}

var pause = false;
function pauseGame() {
   // if (pause == false)

}

