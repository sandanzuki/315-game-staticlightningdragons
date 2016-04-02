#include "tileinfo.h"

TileInfo::TileInfo(){
    
}

TileInfo::TileInfo(int _tile_id, int _location_x, int _location_y, Unit _occupant, list<Effect> _effects){
    tile_id = _tile_id;
    location_x = _location_x;
    location_y = _location_y;
    occupant = _occupant;
    effects = _effects;
}

TileInfo::~TileInfo(){
    
}