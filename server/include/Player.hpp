#ifndef PLAYER_H
#define PLAYER_H

#include "Connection.hpp"

#include <string>

using namespace std;

class Player
{
    public:
        Player(int _player_id, Connection *_conn);

        // Getters
        int get_player_id() { return player_id; }
        int get_game_id() { return game_id; }
        //string get_name() { return name; }
        Connection *get_connection() { return connection; }

        // Setters
        void set_game_id(int _game_id) { game_id = _game_id; }
    
    private:
        int player_id;
        int game_id;
        //string name;
        Connection *connection;
};

#endif
