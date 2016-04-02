#ifndef TILEINFO_H
#define TILEINFO_H

#include <list>
#include "effect.h"
#include "unit.h"

using namespace std;

class TileInfo {
    public:
        TileInfo();
        TileInfo(int _tile_id, int _location_x, int _location_y, Unit _occupant, list<Effect> _effects);
        ~TileInfo();
        int get_tile_id() { return tile_id; }
        int get_location_x() { return location_x; }
        int get_location_y() { return location_y; }
        Unit get_occupant() { return occupant; }
        list<Effect> get_effects() { return effects; }
    
    private:
        int tile_id;
        int location_x;
        int location_y;
        Unit occupant;
        list<Effect> effects;
    
};

#endif