#ifndef TILEINFO_H
#define TILEINFO_H

#include "Effect.hpp"
#include "Unit.hpp"

#include <vector>

using namespace std;

class TileInfo
{
    public:
        TileInfo(int _x, int _y, bool _blocked) { x = _x; y = _y; blocked = _blocked; occupant = NULL; }

        void add_effect(Effect *_effect) { effects.push_back(_effect); }
        void set_occupant(Unit *_occupant) { occupant = _occupant; }

        // Getters
        int get_x() { return x; }
        int get_y() { return y; }
        bool is_blocked() { return blocked; }
        Unit *get_occupant() { return occupant; }
        bool has_effects() { return !effects.empty(); }
        vector<Effect*> &get_effects() { return effects; }
    
    private:
        int x;
        int y;
        bool blocked; // determines if the tile may be traversed.
        Unit *occupant;
        vector<Effect*> effects;
};

#endif
