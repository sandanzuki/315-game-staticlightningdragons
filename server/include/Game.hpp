#ifndef GAME_H
#define GAME_H

#include "Event.hpp"
#include "GameState.hpp"
#include "LogWriter.hpp"
#include "MapInfo.hpp"
#include "Player.hpp"
#include "Unit.hpp"

#include <map>
#include <vector>

#include "json/json.h"

class Game : public GameState
{
    public:
        // Constructor and Destructor
        Game(int _game_id, MapInfo *_map);

        // Getters
        bool needs_player();

        bool tick(double time_in_seconds);
        void handle_request(Player *p, EventRequest *req);

    private:
        void handle_player_quit(Player *p, EventRequest *r);
        void notify_state_change();

        Player *player_one;
        Player *player_two;

        int game_id;                // the ID for this game
        GameState *current_state;   // the current callable state
        MapInfo *map;               // the map itself
};

#endif
