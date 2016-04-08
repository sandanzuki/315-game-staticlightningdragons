#include "Player.hpp"

Player::Player(int _player_id, Connection *_conn)
{
    player_id = _player_id;
    game_id = 0; // no game by default
    //name = _name;
    connection = _conn;
}
