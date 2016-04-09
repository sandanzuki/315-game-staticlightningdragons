var TopDownGame = TopDownGame || {};

TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
    preload: function(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

	    //load map
	    this.load.tilemap('Map', 'MediaAssets/tileMaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('gameTiles', 'MediaAssets/mapTiles.png');

    	//blue units
    	this.load.image('b_archer', 'MediaAssets/b_archer.png');
    	this.load.image('b_mage', 'MediaAssets/b_mage.png');
    	this.load.image('b_fighter', 'MediaAssets/b_fighter.png');

	    //red units
	    this.load.image('r_archer', 'MediaAssets/r_archer.png');
	    this.load.image('r_mage', 'MediaAssets/r_mage.png');
	    this.load.image('r_fighter', 'MediaAssets/r_fighter.png');

	    this.game.state.start('Game');
    }
}