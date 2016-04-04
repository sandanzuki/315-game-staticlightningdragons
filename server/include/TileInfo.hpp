#ifndef TILEINFO_H
#define TILEINFO_H

#include <vector>
#include "Effect.hpp"
#include "Unit.hpp"

using namespace std;

class TileInfo {
    public:
        TileInfo();
        TileInfo(int _tile_id, int _x, int _y, Unit *_occupant, vector<Effect> _effects);
        ~TileInfo();
        int get_tile_id() { return tile_id; }
        int get_x() { return x; }
        int get_y() { return y; }
        Unit *get_occupant() { return occupant; }
        vector<Effect> get_effects() { return effects; }
        void enter_tile(Unit *_occupant);
        void exit_tile();
    
    private:
        int tile_id;
        int x;
        int y;
        bool blocked; // determines if the tile may be traversed.
        Unit *occupant;
        vector<Effect> effects;
    
};

#endif
