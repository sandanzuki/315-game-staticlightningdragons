#include "GameState.hpp"

GameState::GameState(int _game_id, Player *_player_one, Player *_player_two)
{
    game_id = _game_id;
    player_one = _player_one;
    player_two = _player_two;
    state_name = NONE;
}

void GameState::send_all_players(Event &e)
{
    if(player_one != NULL)
    {
        player_one->get_connection()->submit_outgoing_event(e);
    }
    if(player_two != NULL)
    {
        player_two->get_connection()->submit_outgoing_event(e);
    }
}
