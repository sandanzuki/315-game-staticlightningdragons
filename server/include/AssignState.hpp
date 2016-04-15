#ifndef ASSIGN_STATE_HPP
#define ASSIGN_STATE_HPP

#include "GameState.hpp"

class AssignState : public GameState
{
    public:
        AssignState(int _game_id);

        void handle_request(Player *p, EventRequest *r);
        bool tick(double time);

    private:
        void handle_assign_game(Player *p, EventRequest *r);
        void notify_assign_game(EventRequest *r);
};

#endif
