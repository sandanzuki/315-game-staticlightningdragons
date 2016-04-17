#ifndef SELECTION_STATE_HPP
#define SELECTION_STATE_HPP

#include "Event.hpp"
#include "GameState.hpp"
#include "GenericResponses.hpp"
#include "LogWriter.hpp"
#include "Player.hpp"
#include "RequestVerification.hpp"
#include "Unit.hpp"

#include <string>
#include <vector>

class SelectionState : public GameState
{
    public:
        SelectionState(LogWriter *log, int _game_id, Player *_player_one, Player *_player_two)
            : GameState(log, _game_id, _player_one, _player_two) { state_name = SELECTION; }

        void handle_request(Player *p, EventRequest *r);
        bool tick(double time);

        vector<Unit*> get_player_one_units() { return units_one; }
        vector<Unit*> get_player_two_units() { return units_two; }

    private:
        void handle_unit_selection(Player *p, EventRequest *r);
        void notify_select_units(Player *p, EventRequest *r);

        vector<Unit*> units_one;
        vector<Unit*> units_two;
};

#endif
