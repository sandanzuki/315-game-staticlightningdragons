
var game = game || {},
    map,
    background,
    blocked;

game = new Phaser.Game(900, 660, Phaser.AUTO,'', { preload: preload, create: create, update: update });

var cursor,
    tileX,
    tileY,
    bFighter1, bFighter2, bArcher1, bArcher2, bMage,
    rFighter1, rFighter2, rArcher1, rArcher2, rMage;


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
	// show map
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

    downButton.onDown.add(moveDown, this);
    upButton.onDown.add(moveUp, this);
    leftButton.onDown.add(moveLeft, this);
    rightButton.onDown.add(moveRight, this);
    pauseButton.onDown.add(pauseGame, this);

    enterButton.onDown.add(moveMenu, this);
}

//function for loading units to tilemap
function loadUnits(){
    //unitTypes will be represented as such:
        //nothing = 0
        //fighters = 1
        //archers = 2
        //mages = 3
    //calculate same x coords for all blues and reds


    // add all blue sprites to the map
    bFighter1 = game.add.sprite(0, 0,'b_fighter');
    map.getTileWorldXY(0,0).properties.unitType = 1;

    bFighter2 = game.add.sprite(0, 240,'b_fighter');
    map.getTileWorldXY(0,240).properties.unitType = 1;

    bArcher1 = game.add.sprite(0, 60,'b_archer');
    map.getTileWorldXY(0, 60).properties.unitType = 2;

    bArcher2 = game.add.sprite(0, 180,'b_archer');
    map.getTileWorldXY(0, 180).properties.unitType = 2;

    bMage = game.add.sprite(0, 120,'b_mage');
    map.getTileWorldXY(0, 120).properties.unitType = 3;

    // add all red sprites
    var x = map.widthInPixels-60;
    rFighter1 = game.add.sprite(x, 180, 'r_fighter');
    map.getTileWorldXY(x, 180).properties.unitType = 1;

    rFighter2 = game.add.sprite(x, 420, 'r_fighter');
    map.getTileWorldXY(x, 420).properties.unitType = 1;

    rArcher1 = game.add.sprite(x, 240, 'r_archer');
    map.getTileWorldXY(x, 240).properties.unitType = 2;

    rArcher2 = game.add.sprite(x, 360, 'r_archer');
    map.getTileWorldXY(x, 360).properties.unitType = 2;

    rMage = game.add.sprite(x, 300, 'r_mage');
    map.getTileWorldXY(x, 300).properties.unitType = 3;
}

// functions for moving the cursor around one tile at a time
function moveDown() {
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

function moveUp() {
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

function moveLeft() {
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

function moveRight() {
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

function moveMenu() {
    var x = game.math.snapToFloor(Math.floor(cursor.x), 60) / 60;
    var y = game.math.snapToFloor(Math.floor(cursor.y), 60) / 60;
    var currTile = map.getTile(x,y, background);

    switch(currTile.properties.unitType){
        case 1:
            fighterMoveOptions(currTile);
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            window.alert("No unit");
            break;
    }
}

function fighterMoveOptions(currTile){
    var possibleTiles;
    var x = currTile.x;
    var y = currTile.y;
    var i = background.index;

    possibleTiles = [map.getTileRight(i,x,y), map.getTileLeft(i,x,y), map.getTileRight(i,x,y), map.getTileBelow(i,x,y)];

    for(var j=0; j<possibleTiles.length; j++){
        var tile = possibleTiles[j];
        graphics = game.add.graphics();
        graphics.lineStyle(2, 0x33ff33, 1);
        graphics.beginFill(0x33ff33, .5)
        graphics.drawRect(tile.worldX + 1, tile.worldY + 1, 58, 58);
        graphics.endfill();
    }
}

function archerMoveOptions(currTile){

}

function mageMoveOptions(currTile){

}


var pause = false;


function pauseGame() {
   // if (pause == false)

}

