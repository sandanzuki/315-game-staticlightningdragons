#ifndef PLAYING_STATE_HPP
#define PLAYING_STATE_HPP

#include "GameState.hpp"

class PlayingState
{
    public:
        PlayingState(int _game_id, Player *_player_one, Player *_player_two,
                vector<Unit*> _units_one, vector<Unit*> units_two, MapInfo *_map);

        void handle_request(Player *p, EventRequest *r);
        bool tick(double time);

    private:
        bool tile_reachable(int distance, int x, int y, int to_x, int to_y);
        void handle_turn_change(Player *p, EventRequest *r);
        void handle_unit_interact(Player *p, EventRequest *r);
        void handle_unit_move(Player *p, EventRequest *r);
        void notify_turn_change(EventRequest *r);
        void notify_unit_interact(EventRequest *r, Unit *first, Unit *second);
        void notify_unit_move(EventRequest *r, Unit *target);
        
        vector<Unit*> units_one;
        vector<Unit*> units_two;
        int player_turn;
        MapInfo *map;
};

#endif
