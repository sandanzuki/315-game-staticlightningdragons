#include "tileinfo.h"

TileInfo::TileInfo(){
    
}

TileInfo::TileInfo(int _tile_id, int _x, int _y, Unit _occupant, vector<Effect> _effects){
    tile_id = _tile_id;
    x = _x;
    y = _y;
    occupant = _occupant;
    effects = _effects;
}

TileInfo::~TileInfo(){
    
}


TileInfo::enter_tile(Unit _occupant) {
    if(occupant == NULL) {
        occupant = _occupant;
        occupant.add_effects(effects); 
    }
}

TileInfo::exit_tile() {
    if(occupant != NULL) occupant.remove_effects(effects);
    occupant = NULL;
}