#include "gamestate.h"

GameState::GameState(int _game_id, int _map_width, int _map_height, map<int, TileInfo> _tiles, vector<Unit> _units) {
    game_id = _game_id;
    map_width = _map_width;
    map_height = _map_height;
    tiles = _tiles;
    units = _units;
}

GameState::~GameState() {
    
}