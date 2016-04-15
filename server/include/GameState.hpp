#ifndef GAME_STATE_HPP
#define GAME_STATE_HPP

#include "Player.hpp"

enum StateName
{
    ASSIGN,
    SELECTION,
    PLAYING,
    REMATCH,
    NONE
};

class GameState
{
    public:
        GameState(int _game_id, Player *_player_one, Player *_player_two);

        int get_game_id() { return game_id; }
        StateName get_name() { return state_name; }
        Player *get_player_one() { return player_one; }
        Player *get_player_two() { return player_two; }

        virtual void handle_request(Player *p, EventRequest *r) = 0;
        virtual bool tick(double time) = 0;

    protected:
        void send_all_players(Event &e);

        int game_id;
        StateName state_name;
        Player *player_one;
        Player *player_two;
};

#endif
