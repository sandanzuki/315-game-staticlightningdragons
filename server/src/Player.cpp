#include "Player.hpp"

Player::Player(int _player_id, int _game_id, string _name, Connection *_conn)
{
    player_id = _player_id;
    game_id = _game_id;
    name = _name;
    connection = _conn;
}
