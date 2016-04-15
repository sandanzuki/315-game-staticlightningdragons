#ifndef REMATCH_STATE_HPP
#define REMMATCH_STATE_HPP

#include "Event.hpp"
#include "GameState.hpp"
#include "Player.hpp"

class RematchState : public GameState
{
    public:
        RematchState(int _game_id, Player *player_one, Player *player_two);

        void handle_request(Player *p, EventRequest *r);
        bool tick(double time);

    private:
        bool player_one_accepted;
        bool player_two_accepted;
};

#endif
