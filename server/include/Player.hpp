#ifndef PLAYER_H
#define PLAYER_H

#include <string>
#include "Connection.hpp"

using namespace std;

class Player {
    public:
        Player(int _player_id, int _game_id, string _name);
        ~Player();
        int get_player_id() { return player_id; }
        int get_game_id() { return game_id; }
        string get_name() { return name; }
    
    private:
        int player_id;
        int game_id;
        string name;
        Connection *connection;
};

#endif
