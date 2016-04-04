#ifndef GAMESTATE_H
#define GAMESTATE_H

#include <vector>
#include <map>
#include <string>
#include "tileinfo.h"
#include "unit.h"

using namespace std;

class GameState {
    public:
        GameState(int _game_id, int _map_width, int _map_height, map<int, TileInfo> _tiles, vector<Unit> _units);
        ~GameState();
        int get_game_id() { return game_id; }
        int get_map_width() { return map_width; }
        int get_map_height() { return map_height; }
        map<int, TileInfo> get_tiles() { return tiles; }
        vector<Unit> get_units() { return units; }
        void tick(double time_in_seconds); // ticks the gamestate and possibly generates events.
        void handle_request(EventRequest req); // attempt to handle an EventRequest.
    
    private:
        int game_id;
        int map_width;
        int map_height;
        map<int, TileInfo> tiles; // mapping from tile id to corresponding infos.
        vector<Unit> units; // list of all Units in this game.
    
};

#endif