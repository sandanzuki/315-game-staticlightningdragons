#ifndef GAME_H
#define GAME_H

#include "Event.hpp"
#include "GameState.hpp"
#include "LogWriter.hpp"
#include "Player.hpp"
#include "Unit.hpp"

#include <map>
#include <string>
#include <vector>
#include <utility>

#include "json/json.h"

using namespace std;

class Game : public GameState
{
    public:
        // Constructor and Destructor
        Game(int _game_id, std::string _map_file);
        ~Game();

        // Getters
        bool needs_player();

        // Tick the Game. Return FALSE if game is over, TRUE otherwise.
        bool tick(double time_in_seconds);

        // Handle an EventRequest bound for this Game.
        void handle_request(Player *p, EventRequest *req);

    private:
        // Handle EventRequests
        void handle_assign_game(Player *p, EventRequest *r);
        void handle_player_quit(Player *p, EventRequest *r);

        // Send notifications of Events to Players.
        void notify_assign_game(EventRequest *r);
        void notify_state_change(EventRequest *r);

        GameState *current_state;   // the current callable state

        Player *player_one;     // the first Player in the game
        Player *player_two;     // the second Player in the game
};

#endif
