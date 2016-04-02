#ifndef GAMESTATE_H
#define GAMESTATE_H

#include <list>
#include <map>
#include <string>
#include "tileinfo.h"
#include "unit.h"

using namespace std;

class GameState {
    public:
        GameState(int _game_id, int _map_width, int _map_height, map<int, TileInfo> _tiles, list<Unit> _units);
        ~GameState();
        int get_game_id() { return game_id; }
        int get_map_width() { return map_width; }
        int get_map_height() { return map_height; }
        map<int, TileInfo> get_tiles() { return tiles; }
        list<Unit> get_units() { return units; }
    
    private:
        int game_id;
        int map_width;
        int map_height;
        map<int, TileInfo> tiles;
        list<Unit> units;
    
};

#endif