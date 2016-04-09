#ifndef GAMESTATE_H
#define GAMESTATE_H

#include "Event.hpp"
#include "Player.hpp"
#include "TileInfo.hpp"
#include "Unit.hpp"

#include <map>
#include <string>
#include <vector>

#include "json/json.h"

using namespace std;

enum State
{
    WAITING_FOR_PLAYERS,
    UNIT_SELECTION,
    GAME_PLAYING,
    GAME_OVER
};

class GameState
{
    public:
        // Constructor and Destructor
        GameState(int _game_id, string _map_file);
        ~GameState();

        // Getters
        int get_game_id() { return game_id; }
        int get_map_width() { return map_width; }
        int get_map_height() { return map_height; }
        map<int, TileInfo*> &get_tiles() { return tiles; }
        vector<Unit*> &get_units() { return units; }

        // Tick the GameState. Return FALSE if game is over, TRUE otherwise.
        bool tick(double time_in_seconds);

        // Handle an EventRequest bound for this GameState.
        void handle_request(Player *p, EventRequest *req);

        // Used for initially setting up the game.
        void add_player(Player *p);
        bool needs_player();
    
    private:
        // Build the map (this->tiles) from a JSON file.
        void build_map_from_file(string &map_filename);

        // Send notifications of events to Players.
        void send_all_players(Event &e);
        void notify_assign_game(EventRequest *r);
        void notify_select_units(EventRequest *r, Player *p);
        void notify_state_change(EventRequest *r);
        void notify_turn_change(EventRequest *r);
        void notify_unit_interact(EventRequest *r, Unit *first, Unit *second);
        void notify_unit_move(EventRequest *r, Unit *target);

        int game_id;        // ID of the Game
        int map_width;      // width of the map in tiles
        int map_height;     // height of the map in tiles

        State current_gamestate;    // the current state of this GameState

        map<int, TileInfo*> tiles;  // all of the non-standard tiles on the map
        vector<Unit*> units;        // all of the units currently in-play

        Player *player_one;     // the first Player in the game
        Player *player_two;     // the second Player in the game
};

#endif
