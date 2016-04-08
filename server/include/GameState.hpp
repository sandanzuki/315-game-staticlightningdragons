#ifndef GAMESTATE_H
#define GAMESTATE_H

#include "Player.hpp"
#include "TileInfo.hpp"
#include "Unit.hpp"

#include <vector>
#include <map>
#include <string>

#include "json/json.h"

using namespace std;

typedef Json::Value EventRequest;
typedef Json::Value Event;

class GameState {
    public:
        GameState(int _game_id, std::string _map_file);
        ~GameState();
        int get_game_id() { return game_id; }
        int get_map_width() { return map_width; }
        int get_map_height() { return map_height; }
        map<int, TileInfo> get_tiles() { return tiles; }
        vector<Unit> get_units() { return units; }
        void tick(double time_in_seconds); // ticks the gamestate and possibly generates events.
        void handle_request(EventRequest *req) {} // attempt to handle an EventRequest.
        void add_player(Player *p);
        bool needs_player();
    
    private:
        int game_id;
        string map_file;
        int map_width;
        int map_height;
        map<int, TileInfo> tiles; // mapping from tile id to corresponding infos.
        vector<Unit> units; // list of all Units in this game.
        Player *player_one;
        Player *player_two;
};

#endif
